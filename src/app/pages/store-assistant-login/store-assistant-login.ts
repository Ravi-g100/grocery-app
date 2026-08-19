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

  errorMessage = '';


  constructor(

    private fb: FormBuilder,

    private router: Router

  ) {


    this.assistantLoginForm =
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
  // STORE ASSISTANT LOGIN
  // ==========================================

  login(): void {


    if (
      this.assistantLoginForm.invalid
    ) {

      this.assistantLoginForm.markAllAsTouched();

      return;

    }


    const username =
      this.assistantLoginForm
        .get('username')
        ?.value
        ?.trim()
        .toLowerCase();


    const password =
      this.assistantLoginForm
        .get('password')
        ?.value;


    // ==========================================
    // CLEAR OLD ASSISTANT LOGIN
    // ==========================================

    localStorage.removeItem(
      'storeAssistantLoggedIn'
    );

    localStorage.removeItem(
      'storeAssistantRole'
    );


    // ==========================================
    // STORE ASSISTANT CREDENTIALS
    // ==========================================

    if (

      username === 'storeassistant' &&

      password === 'assistant123'

    ) {


      localStorage.setItem(
        'storeAssistantLoggedIn',
        'true'
      );


      localStorage.setItem(
        'storeAssistantRole',
        'store-assistant'
      );


      this.errorMessage = '';


      // ========================================
      // ASSISTANT DASHBOARD
      // ========================================

      this.router.navigate([
        '/admin-dashboard'
      ]);


      return;

    }


    // ==========================================
    // INVALID LOGIN
    // ==========================================

    this.errorMessage =
      'Invalid Store Assistant Username or Password.';

  }

}