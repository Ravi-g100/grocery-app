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

import { HttpClient } from '@angular/common/http';


@Component({

  selector: 'app-store-assistant-register',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './store-assistant-register.html',

  styleUrl: './store-assistant-register.css'

})
export class StoreAssistantRegisterComponent {


  registerForm: FormGroup;

  loading = false;

  successMessage = '';

  errorMessage = '';


  // Backend URL
  private apiUrl = 'http://localhost:3000/api/staff';


  constructor(

    private fb: FormBuilder,

    private http: HttpClient,

    private router: Router

  ) {


    this.registerForm =
      this.fb.group({

        fullname: [
          '',
          [
            Validators.required,
            Validators.minLength(3)
          ]
        ],

        mobile: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{10}$/)
          ]
        ],

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
            Validators.required,
            Validators.minLength(6)
          ]
        ],

        address: [
          ''
        ],

        city: [
          ''
        ],

        pincode: [
          '',
          Validators.pattern(/^[0-9]{6}$/)
        ]

      });

  }


  // ==================================================
  // REGISTER
  // ==================================================

  register(): void {


    // Check form
    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }


    this.loading = true;

    this.successMessage = '';

    this.errorMessage = '';


    // IMPORTANT:
    // Backend route is /request
    // NOT /register

    this.http.post<any>(

      `${this.apiUrl}/request`,

      this.registerForm.value

    )
    .subscribe({

      next: (response) => {

        this.loading = false;


        this.successMessage =
          response.message ||
          'Registration request submitted successfully.';


        this.registerForm.reset();

      },


      error: (error) => {

        this.loading = false;


        console.error(
          'Store Assistant registration error:',
          error
        );


        this.errorMessage =
          error?.error?.message ||
          'Unable to submit registration request.';

      }

    });

  }

}