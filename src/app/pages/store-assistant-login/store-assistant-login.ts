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

import { StaffService } from '../../services/staff';


@Component({

  selector: 'app-store-assistant-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './store-assistant-login.html',

  styleUrl: './store-assistant-login.css'

})
export class StoreAssistantLoginComponent {


  assistantLoginForm: FormGroup;

  loading = false;

  errorMessage = '';


  constructor(

    private fb: FormBuilder,

    private staffService: StaffService,

    private router: Router

  ) {


    this.assistantLoginForm =
      this.fb.group({

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        password: [
          '',
          [
            Validators.required
          ]
        ]

      });

  }


  // ==================================================
  // STORE ASSISTANT LOGIN
  // ==================================================

  login(): void {


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      this.assistantLoginForm.invalid
    ) {

      this.assistantLoginForm.markAllAsTouched();

      return;

    }


    // ==================================================
    // GET VALUES
    // ==================================================

    const email =
      this.assistantLoginForm
        .get('email')
        ?.value
        ?.trim()
        .toLowerCase();


    const password =
      this.assistantLoginForm
        .get('password')
        ?.value;


    // ==================================================
    // CLEAR OLD LOGIN DATA
    // ==================================================

    localStorage.removeItem(
      'storeAssistantLoggedIn'
    );

    localStorage.removeItem(
      'storeAssistantRole'
    );

    localStorage.removeItem(
      'storeAssistantPermissions'
    );

    localStorage.removeItem(
      'storeAssistantUser'
    );


    this.loading = true;

    this.errorMessage = '';


    // ==================================================
    // LOGIN API
    // ==================================================

    this.staffService
      .login(
        email,
        password
      )
      .subscribe({

        // ==================================================
        // SUCCESS
        // ==================================================

        next: (response) => {

          this.loading = false;


          console.log(
            'Store Assistant Login Response:',
            response
          );


          // ==================================================
          // CHECK SERVER RESPONSE
          // ==================================================

          if (
            !response ||
            !response.assistant
          ) {

            this.errorMessage =
              'Invalid server response.';

            return;

          }


          // ==================================================
          // ASSISTANT DETAILS
          // ==================================================

          const assistant =
            response.assistant;


          // ==================================================
          // PERMISSIONS
          // ==================================================

          const permissions = {

            dashboard:
              assistant.permissions
                ?.dashboard === true,

            orders:
              assistant.permissions
                ?.orders === true,

            products:
              assistant.permissions
                ?.products === true,

            categories:
              assistant.permissions
                ?.categories === true,

            users:
              assistant.permissions
                ?.users === true

          };


          console.log(
            'Store Assistant Permissions:',
            permissions
          );


          // ==================================================
          // SAVE LOGIN
          // ==================================================

          localStorage.setItem(
            'storeAssistantLoggedIn',
            'true'
          );


          localStorage.setItem(
            'storeAssistantRole',
            'store-assistant'
          );


          localStorage.setItem(
            'storeAssistantPermissions',
            JSON.stringify(
              permissions
            )
          );


          localStorage.setItem(
            'storeAssistantUser',
            JSON.stringify(
              assistant
            )
          );


          // ==================================================
          // OPEN FIRST ALLOWED PAGE
          // ==================================================

          if (
            permissions.dashboard
          ) {

            this.router.navigate([
              '/admin-dashboard'
            ]);

            return;

          }


          if (
            permissions.orders
          ) {

            this.router.navigate([
              '/admin-orders'
            ]);

            return;

          }


          if (
            permissions.products
          ) {

            this.router.navigate([
              '/admin-products'
            ]);

            return;

          }


          if (
            permissions.categories
          ) {

            this.router.navigate([
              '/admin-categories'
            ]);

            return;

          }


          if (
            permissions.users
          ) {

            this.router.navigate([
              '/admin-users'
            ]);

            return;

          }


          // ==================================================
          // NO PERMISSION
          // ==================================================

          /*
           * IMPORTANT:
           * Login data REMOVE nahi karenge.
           *
           * Store Assistant logged-in rahega.
           *
           * Login page par redirect bhi nahi karenge.
           */

          this.errorMessage =
            'Login successful, but Admin has not given you access to any section.';

        },


        // ==================================================
        // LOGIN ERROR
        // ==================================================

        error: (error) => {

          this.loading = false;


          console.error(
            'Store Assistant Login Error:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Invalid email or password.';

        }

      });

  }

}

