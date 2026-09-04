import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import { UserService } from '../../services/user';

import { StaffService } from '../../services/staff';


@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './login.html',

  styleUrls: ['./login.css']
})


export class Login {

  // ==========================================
  // LOGIN OPTIONS
  // ==========================================

  showLoginOptions = true;

  selectedLogin:
    'user'
    | 'admin'
    | 'store-assistant'
    | null = null;


  // ==========================================
  // OTHER LOGIN MENU
  // ==========================================

  showOtherLogin = false;


  // ==========================================
  // USER LOGIN
  // ==========================================

  hidePassword = true;

  loading = false;

  loginForm: FormGroup;

  errorMessage = '';


  // ==========================================
  // USER FORGOT PASSWORD
  // ==========================================

  showForgotPassword = false;

  forgotPasswordForm: FormGroup;

  forgotPasswordError = '';

  forgotPasswordMessage = '';


  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  hideAdminPassword = true;

  adminLoading = false;

  adminLoginForm: FormGroup;

  adminErrorMessage = '';


  // ==========================================
  // ADMIN FORGOT PASSWORD
  // ==========================================

  showAdminForgotPassword = false;

  adminForgotPasswordForm: FormGroup;

  adminForgotPasswordError = '';

  adminForgotPasswordMessage = '';


  // ==========================================
  // STORE ASSISTANT LOGIN
  // ==========================================

  hideAssistantPassword = true;

  assistantLoading = false;

  assistantLoginForm: FormGroup;

  assistantErrorMessage = '';


  constructor(
    private fb: FormBuilder,

    private userService: UserService,

    private staffService: StaffService,

    private router: Router
  ) {

    // ========================================
    // USER LOGIN FORM
    // ========================================

    this.loginForm = this.fb.group({

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

      remember: [
        false
      ]

    });


    // ========================================
    // USER FORGOT PASSWORD FORM
    // ========================================

    this.forgotPasswordForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]

    });


    // ========================================
    // ADMIN LOGIN FORM
    // ========================================

    this.adminLoginForm = this.fb.group({

      username: [
        '',
        Validators.required
      ],

      password: [
        '',
        Validators.required
      ]

    });


    // ========================================
    // ADMIN FORGOT PASSWORD FORM
    // ========================================

    this.adminForgotPasswordForm = this.fb.group({

      username: [
        '',
        Validators.required
      ],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]

    });


    // ========================================
    // STORE ASSISTANT LOGIN FORM
    // ========================================

    this.assistantLoginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ]

    });

  }


  // ==========================================
  // SELECT USER LOGIN
  // ==========================================

  selectUserLogin(): void {

    this.showLoginOptions = false;

    this.showOtherLogin = false;

    this.selectedLogin = 'user';

    this.showForgotPassword = false;

    this.errorMessage = '';

  }


  // ==========================================
  // OPEN OTHER LOGIN
  // ==========================================

  openOtherLogin(): void {

    this.showOtherLogin =
      !this.showOtherLogin;

  }


  // ==========================================
  // CLOSE OTHER LOGIN
  // ==========================================

  closeOtherLogin(): void {

    this.showOtherLogin = false;

  }


  // ==========================================
  // STORE ASSISTANT LOGIN
  // ==========================================

  storeAssistantLogin(): void {

    this.showLoginOptions = false;

    this.showOtherLogin = false;

    this.selectedLogin = 'store-assistant';

    this.assistantErrorMessage = '';

    this.assistantLoginForm.reset();

  }


  // ==========================================
  // SELECT ADMIN LOGIN
  // ==========================================

  selectAdminLogin(): void {

    this.showLoginOptions = false;

    this.showOtherLogin = false;

    this.selectedLogin = 'admin';

    this.showAdminForgotPassword = false;

    this.adminErrorMessage = '';

  }


  // ==========================================
  // BACK TO LOGIN OPTIONS
  // ==========================================

  backToLoginOptions(): void {

    this.showLoginOptions = true;

    this.showOtherLogin = false;

    this.selectedLogin = null;

    this.showForgotPassword = false;

    this.showAdminForgotPassword = false;

    this.errorMessage = '';

    this.adminErrorMessage = '';

    this.assistantErrorMessage = '';

  }


  // ==========================================
  // USER LOGIN
  // ==========================================

  login(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    this.loading = true;

    this.errorMessage = '';


    const email =
      this.loginForm.value.email
        .trim()
        .toLowerCase();


    const password =
      this.loginForm.value.password;


    this.userService
      .loginUser(
        email,
        password
      )
      .subscribe({

        next: (user) => {

          this.loading = false;


          // ==================================
          // CHECK BLOCKED USER
          // ==================================

          if (user.blocked) {

            this.errorMessage =
              'Your account has been blocked by admin.';

            return;

          }


          // ==================================
          // CLEAR OLD LOGIN
          // ==================================

          localStorage.removeItem(
            'currentUser'
          );

          sessionStorage.removeItem(
            'currentUser'
          );

          localStorage.removeItem(
            'adminLoggedIn'
          );

          localStorage.removeItem(
            'adminRole'
          );

          localStorage.removeItem(
            'adminUser'
          );

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


          // ==================================
          // SAVE USER LOGIN
          // ==================================

          localStorage.setItem(
            'currentUser',
            user.email
          );


          // ==================================
          // SUCCESS
          // ==================================

          alert(
            'Login Successful'
          );


          this.router.navigateByUrl(
            '/dashboard'
          );

        },


        error: (error) => {

          this.loading = false;


          console.error(
            'Login error:',
            error
          );


          if (
            error.status === 401
          ) {

            this.errorMessage =
              'Invalid email or password.';

          }

          else if (
            error.status === 400
          ) {

            this.errorMessage =
              'Email and password are required.';

          }

          else {

            this.errorMessage =
              'Unable to login. Please try again.';

          }

        }

      });

  }


  // ==========================================
  // OPEN USER FORGOT PASSWORD
  // ==========================================

  openForgotPassword(): void {

    this.showForgotPassword = true;

    this.forgotPasswordError = '';

    this.forgotPasswordMessage = '';

  }


  // ==========================================
  // CLOSE USER FORGOT PASSWORD
  // ==========================================

  closeForgotPassword(): void {

    this.showForgotPassword = false;

    this.forgotPasswordError = '';

    this.forgotPasswordMessage = '';

    this.forgotPasswordForm.reset();

  }


  // ==========================================
  // USER FORGOT PASSWORD
  // ==========================================

  forgotPassword(): void {

    if (
      this.forgotPasswordForm.invalid
    ) {

      this.forgotPasswordForm.markAllAsTouched();

      return;

    }


    this.forgotPasswordError = '';

    this.forgotPasswordMessage = '';


    const email =
      this.forgotPasswordForm.value.email
        .trim()
        .toLowerCase();


    const newPassword =
      this.forgotPasswordForm.value.newPassword;


    const confirmPassword =
      this.forgotPasswordForm.value.confirmPassword;


    // ========================================
    // PASSWORD MATCH
    // ========================================

    if (
      newPassword !==
      confirmPassword
    ) {

      this.forgotPasswordError =
        'New password and confirm password do not match.';

      return;

    }


    // ========================================
    // UPDATE PASSWORD
    // ========================================

    this.userService
      .updatePassword(
        email,
        newPassword
      )
      .subscribe({

        next: () => {

          this.forgotPasswordMessage =
            'Password reset successfully. You can login now.';

          this.forgotPasswordError = '';

          this.forgotPasswordForm.reset();

        },

        error: (error) => {

          console.error(
            'Forgot password error:',
            error
          );


          if (
            error.status === 404
          ) {

            this.forgotPasswordError =
              'No account found with this email.';

          }

          else {

            this.forgotPasswordError =
              'Password reset failed. Please try again.';

          }

        }

      });

  }


  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  adminLogin(): void {

    if (
      this.adminLoginForm.invalid
    ) {

      this.adminLoginForm.markAllAsTouched();

      return;

    }


    this.adminLoading = true;

    this.adminErrorMessage = '';


    const username =
      this.adminLoginForm.value.username
        .trim();


    const password =
      this.adminLoginForm.value.password;


    const savedPassword =
      localStorage.getItem(
        'adminPassword'
      );


    const correctPassword =
      savedPassword ||
      'admin123';


    setTimeout(() => {

      // ====================================
      // ADMIN LOGIN SUCCESS
      // ====================================

      if (
        username === 'admin' &&
        password === correctPassword
      ) {

        // ==================================
        // REMOVE USER LOGIN
        // ==================================

        localStorage.removeItem(
          'currentUser'
        );

        sessionStorage.removeItem(
          'currentUser'
        );


        // ==================================
        // REMOVE STORE ASSISTANT LOGIN
        // ==================================

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


        // ==================================
        // SAVE ADMIN LOGIN
        // ==================================

        localStorage.setItem(
          'adminLoggedIn',
          'true'
        );

        localStorage.setItem(
          'adminRole',
          'admin'
        );


        this.adminLoading = false;

        this.adminErrorMessage = '';


        alert(
          'Admin Login Successful'
        );


        this.router.navigateByUrl(
          '/admin-dashboard'
        );

      }

      else {

        this.adminLoading = false;

        this.adminErrorMessage =
          'Invalid Admin Username or Password';

      }

    }, 500);

  }


  // ==========================================
  // OPEN ADMIN FORGOT PASSWORD
  // ==========================================

  openAdminForgotPassword(): void {

    this.showAdminForgotPassword = true;

    this.adminForgotPasswordError = '';

    this.adminForgotPasswordMessage = '';

  }


  // ==========================================
  // CLOSE ADMIN FORGOT PASSWORD
  // ==========================================

  closeAdminForgotPassword(): void {

    this.showAdminForgotPassword = false;

    this.adminForgotPasswordError = '';

    this.adminForgotPasswordMessage = '';

    this.adminForgotPasswordForm.reset();

  }


  // ==========================================
  // ADMIN FORGOT PASSWORD
  // ==========================================

  adminForgotPassword(): void {

    if (
      this.adminForgotPasswordForm.invalid
    ) {

      this.adminForgotPasswordForm.markAllAsTouched();

      return;

    }


    this.adminForgotPasswordError = '';

    this.adminForgotPasswordMessage = '';


    const username =
      this.adminForgotPasswordForm.value.username
        .trim();


    const newPassword =
      this.adminForgotPasswordForm.value.newPassword;


    const confirmPassword =
      this.adminForgotPasswordForm.value.confirmPassword;


    // ======================================
    // CHECK ADMIN USERNAME
    // ======================================

    if (
      username !== 'admin'
    ) {

      this.adminForgotPasswordError =
        'Invalid admin username.';

      return;

    }


    // ======================================
    // CHECK PASSWORD
    // ======================================

    if (
      newPassword !==
      confirmPassword
    ) {

      this.adminForgotPasswordError =
        'New password and confirm password do not match.';

      return;

    }


    // ======================================
    // SAVE ADMIN PASSWORD
    // ======================================

    localStorage.setItem(
      'adminPassword',
      newPassword
    );


    this.adminForgotPasswordMessage =
      'Admin password reset successfully.';


    this.adminForgotPasswordForm.reset();

  }


  // ==========================================
  // STORE ASSISTANT LOGIN
  // ==========================================

  assistantLogin(): void {

    if (
      this.assistantLoginForm.invalid
    ) {

      this.assistantLoginForm.markAllAsTouched();

      return;

    }


    this.assistantLoading = true;

    this.assistantErrorMessage = '';


    const email =
      this.assistantLoginForm.value.email
        .trim()
        .toLowerCase();


    const password =
      this.assistantLoginForm.value.password;


    // ========================================
    // LOGIN THROUGH STAFF SERVICE
    // ========================================

    this.staffService
      .login(
        email,
        password
      )
      .subscribe({

        next: (response) => {

          this.assistantLoading = false;


          // ==================================
          // GET ASSISTANT DATA
          // ==================================

          const assistant =
            response?.assistant;


          if (!assistant) {

            this.assistantErrorMessage =
              'Invalid Store Assistant login response.';

            return;

          }


          // ==================================
          // CLEAR OLD LOGIN
          // ==================================

          localStorage.removeItem(
            'currentUser'
          );

          sessionStorage.removeItem(
            'currentUser'
          );

          localStorage.removeItem(
            'adminLoggedIn'
          );

          localStorage.removeItem(
            'adminRole'
          );

          localStorage.removeItem(
            'adminUser'
          );


          // ==================================
          // SAVE ASSISTANT LOGIN
          // ==================================

          localStorage.setItem(
            'storeAssistantLoggedIn',
            'true'
          );

          localStorage.setItem(
            'storeAssistantRole',
            'store-assistant'
          );


          // ==================================
          // NORMALIZE PERMISSIONS
          // ==================================

          const permissions = {

            dashboard:
              assistant.permissions?.dashboard === true,

            orders:
              assistant.permissions?.orders === true,

            products:
              assistant.permissions?.products === true,

            categories:
              assistant.permissions?.categories === true,

            users:
              assistant.permissions?.users === true

          };


          localStorage.setItem(
            'storeAssistantPermissions',
            JSON.stringify(permissions)
          );


          // ==================================
          // SAVE ASSISTANT USER
          // ==================================

          localStorage.setItem(
            'storeAssistantUser',
            JSON.stringify(assistant)
          );


          // ==================================
          // SUCCESS
          // ==================================

          alert(
            'Store Assistant Login Successful'
          );


          // ==================================
          // FIRST ALLOWED PAGE
          // ==================================

          if (
            permissions.dashboard
          ) {

            this.router.navigateByUrl(
              '/admin-dashboard'
            );

            return;

          }


          if (
            permissions.orders
          ) {

            this.router.navigateByUrl(
              '/admin-orders'
            );

            return;

          }


          if (
            permissions.products
          ) {

            this.router.navigateByUrl(
              '/admin-products'
            );

            return;

          }


          if (
            permissions.categories
          ) {

            this.router.navigateByUrl(
              '/admin-categories'
            );

            return;

          }


          if (
            permissions.users
          ) {

            this.router.navigateByUrl(
              '/admin-users'
            );

            return;

          }


          // ==================================
          // NO PERMISSION
          // ==================================

          this.assistantErrorMessage =
            'Login successful, but Admin has not given you access to any section.';

        },


        error: (error) => {

          this.assistantLoading = false;


          console.error(
            'Store Assistant login error:',
            error
          );


          if (
            error.status === 401
          ) {

            this.assistantErrorMessage =
              'Invalid email or password, or your request is not approved yet.';

          }

          else if (
            error.status === 400
          ) {

            this.assistantErrorMessage =
              'Email and password are required.';

          }

          else {

            this.assistantErrorMessage =
              'Unable to login as Store Assistant. Please try again.';

          }

        }

      });

  }

}