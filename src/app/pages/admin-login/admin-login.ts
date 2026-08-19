import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

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


@Component({

  selector: 'app-admin-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './admin-login.html',

  styleUrl: './admin-login.css'

})
export class AdminLoginComponent {


  adminLoginForm: FormGroup;

  errorMessage = '';


  constructor(

    private fb: FormBuilder,

    private router: Router

  ) {


    this.adminLoginForm =
      this.fb.group({

        username: [
          '',
          Validators.required
        ],

        password: [
          '',
          Validators.required
        ]

      });

  }


  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  login(): void {


    if (
      this.adminLoginForm.invalid
    ) {

      this.adminLoginForm.markAllAsTouched();

      return;

    }


    const username =
      this.adminLoginForm
        .get('username')
        ?.value
        ?.trim()
        .toLowerCase();


    const password =
      this.adminLoginForm
        .get('password')
        ?.value;


    // ==========================================
    // CLEAR OLD ADMIN LOGIN
    // ==========================================

    localStorage.removeItem(
      'adminLoggedIn'
    );

    localStorage.removeItem(
      'adminRole'
    );


    // ==========================================
    // ADMIN CREDENTIALS
    // ==========================================

    if (

      username === 'admin' &&

      password === '123456'

    ) {


      localStorage.setItem(
        'adminLoggedIn',
        'true'
      );


      localStorage.setItem(
        'adminRole',
        'admin'
      );


      this.errorMessage = '';


      this.router.navigate([
        '/admin-dashboard'
      ]);


      return;

    }


    // ==========================================
    // INVALID LOGIN
    // ==========================================

    this.errorMessage =
      'Invalid Admin Username or Password.';

  }

}