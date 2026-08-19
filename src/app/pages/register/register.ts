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
  UserService
} from '../../services/user';


@Component({

  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './register.html',

  styleUrls: ['./register.css']

})
export class Register {

  hidePassword = true;

  hideConfirmPassword = true;

  registerForm: FormGroup;

  errorMessage = '';

  successMessage = '';


  constructor(

    private fb: FormBuilder,

    private userService: UserService,

    private router: Router

  ) {


    this.registerForm =
      this.fb.group({

        // =========================
        // FULL NAME
        // =========================

        fullname: [

          '',

          Validators.required

        ],


        // =========================
        // MOBILE
        // =========================

        mobile: [

          '',

          [

            Validators.required,

            Validators.pattern(
              '^[6-9][0-9]{9}$'
            )

          ]

        ],


        // =========================
        // EMAIL
        // =========================

        email: [

          '',

          [

            Validators.required,

            Validators.email

          ]

        ],


        // =========================
        // ADDRESS
        // =========================

        address: [

          '',

          Validators.required

        ],


        // =========================
        // CITY
        // =========================

        city: [

          '',

          Validators.required

        ],


        // =========================
        // PINCODE
        // =========================

        pincode: [

          '',

          [

            Validators.required,

            Validators.pattern(
              '^[0-9]{6}$'
            )

          ]

        ],


        // =========================
        // PASSWORD
        // =========================

        password: [

          '',

          [

            Validators.required,

            Validators.minLength(6)

          ]

        ],


        // =========================
        // CONFIRM PASSWORD
        // =========================

        confirmPassword: [

          '',

          Validators.required

        ]

      });

  }


  // ==========================================
  // REGISTER
  // ==========================================

  register(): void {

    this.errorMessage = '';

    this.successMessage = '';


    // ========================================
    // FORM VALIDATION
    // ========================================

    if (
      this.registerForm.invalid
    ) {

      this.registerForm.markAllAsTouched();

      return;

    }


    // ========================================
    // GET FORM VALUES
    // ========================================

    const fullname =
      this.registerForm.value.fullname
        .trim();


    const mobile =
      this.registerForm.value.mobile
        .trim();


    const email =
      this.registerForm.value.email
        .trim()
        .toLowerCase();


    const address =
      this.registerForm.value.address
        .trim();


    const city =
      this.registerForm.value.city
        .trim();


    const pincode =
      this.registerForm.value.pincode
        .trim();


    const password =
      this.registerForm.value.password;


    const confirmPassword =
      this.registerForm.value.confirmPassword;


    // ========================================
    // PASSWORD CHECK
    // ========================================

    if (
      password !==
      confirmPassword
    ) {

      this.errorMessage =
        'Password and Confirm Password do not match.';

      return;

    }


    // ========================================
    // CREATE USER IN MYSQL
    // ========================================

    this.userService
      .registerUser({

        fullname:
          fullname,

        mobile:
          mobile,

        email:
          email,

        password:
          password,

        address:
          address,

        city:
          city,

        pincode:
          pincode

      })
      .subscribe({

        // ====================================
        // SUCCESS
        // ====================================

        next: () => {

          this.successMessage =
            'Registration Successful!';


          alert(
            'Registration Successful'
          );


          this.registerForm.reset();


          this.router.navigate([
            '/login'
          ]);

        },


        // ====================================
        // ERROR
        // ====================================

        error: (error) => {

          console.error(
            'Registration error:',
            error
          );


          // ==================================
          // EMAIL ALREADY EXISTS
          // ==================================

          if (
            error.status === 409
          ) {

            this.errorMessage =
              'This email is already registered.';

            return;

          }


          // ==================================
          // SERVER ERROR
          // ==================================

          this.errorMessage =
            error.error?.message ||
            'Registration failed. Please try again.';

        }

      });

  }

}