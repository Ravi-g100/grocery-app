import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const currentUser =
    localStorage.getItem('currentUser');

  const adminLoggedIn =
    sessionStorage.getItem('adminLoggedIn');

  console.log(
    'AUTH GUARD currentUser:',
    currentUser
  );

  console.log(
    'AUTH GUARD adminLoggedIn:',
    adminLoggedIn
  );


  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  if (adminLoggedIn === 'true') {

    console.log(
      'AUTH GUARD: Admin logged in'
    );

    return true;

  }


  // ==========================================
  // USER LOGIN
  // ==========================================

  if (currentUser) {

    console.log(
      'AUTH GUARD: User logged in'
    );

    return true;

  }


  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  console.log(
    'AUTH GUARD: User/Admin NOT logged in'
  );

  return router.createUrlTree([
    '/login'
  ]);

};