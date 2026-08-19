import { Component } from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  User,
  UserService
} from '../../services/user';


@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './profile.html',

  styleUrl: './profile.css'
})
export class ProfileComponent {

  // =========================
  // PROFILE FORM
  // =========================

  profileForm: FormGroup;

  user: User | undefined;

  message = '';

  errorMessage = '';


  constructor(

    private fb: FormBuilder,

    private userService: UserService,

    private router: Router

  ) {

    // =========================
    // CREATE FORM
    // =========================

    this.profileForm =
      this.fb.group({

        fullname: [
          '',
          Validators.required
        ],

        mobile: [
          '',
          [
            Validators.required,

            Validators.pattern(
              '^[6-9][0-9]{9}$'
            )
          ]
        ],

        email: [
          {
            value: '',
            disabled: true
          },

          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [
          '',
          Validators.minLength(6)
        ]

      });


    // =========================
    // LOAD PROFILE
    // =========================

    this.loadProfile();

  }


  // =========================
  // LOAD PROFILE
  // =========================

  loadProfile(): void {

    const email =
      localStorage.getItem(
        'currentUser'
      );


    // =========================
    // LOGIN CHECK
    // =========================

    if (!email) {

      alert(
        'Please login first.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // =========================
    // GET USER FROM BACKEND
    // =========================

    this.userService
      .getUserByEmail(email)
      .subscribe({

        next: (user) => {

          this.user = user;


          // =======================
          // FILL FORM
          // =======================

          this.profileForm.patchValue({

            fullname:
              user.fullname,

            mobile:
              user.mobile,

            email:
              user.email,

            password:
              ''

          });

        },


        // =======================
        // USER NOT FOUND
        // =======================

        error: (error) => {

          console.error(
            'Profile load error:',
            error
          );


          this.user = undefined;


          alert(
            'User information not found.'
          );


          localStorage.removeItem(
            'currentUser'
          );


          this.router.navigate([
            '/login'
          ]);

        }

      });

  }


  // =========================
  // UPDATE PROFILE
  // =========================

  updateProfile(): void {

    if (
      this.profileForm.invalid ||
      !this.user
    ) {

      this.profileForm
        .markAllAsTouched();

      return;

    }


    // =========================
    // GET FORM VALUES
    // =========================

    const fullname =
      this.profileForm.value.fullname;

    const mobile =
      this.profileForm.value.mobile;

    const password =
      this.profileForm.value.password;


    // =========================
    // UPDATE USER OBJECT
    // =========================

    this.user.fullname =
      fullname;

    this.user.mobile =
      mobile;


    // =========================
    // PASSWORD
    // =========================

    if (password) {

      this.user.password =
        password;

    }


    // =========================
    // UPDATE BACKEND
    // =========================

    this.userService
      .updateUser(this.user)
      .subscribe({

        next: () => {

          this.message =
            'Profile Updated Successfully';

          this.errorMessage = '';

          this.profileForm.patchValue({
            password: ''
          });

        },


        error: (error) => {

          console.error(
            'Profile update error:',
            error
          );

          this.message = '';

          this.errorMessage =
            'Profile update failed. Please try again.';

        }

      });

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    localStorage.removeItem(
      'currentUser'
    );

    sessionStorage.removeItem(
      'currentUser'
    );

    this.router.navigate([
      '/login'
    ]);

  }

}