import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  inject
} from '@angular/core';


export const adminGuard: CanActivateFn = (

  route,
  state

) => {

  const router = inject(Router);


  // ==================================================
  // ADMIN LOGIN
  // ==================================================

  const adminLoggedIn =
    localStorage.getItem(
      'adminLoggedIn'
    ) === 'true';

  const adminRole =
    localStorage.getItem(
      'adminRole'
    );


  // ==================================================
  // STORE ASSISTANT LOGIN
  // ==================================================

  const storeAssistantLoggedIn =
    localStorage.getItem(
      'storeAssistantLoggedIn'
    ) === 'true';

  const storeAssistantRole =
    localStorage.getItem(
      'storeAssistantRole'
    );


  // ==================================================
  // ADMIN = FULL ACCESS
  // ==================================================

  if (
    adminLoggedIn &&
    adminRole === 'admin'
  ) {

    return true;

  }


  // ==================================================
  // STORE ASSISTANT
  // ==================================================

  if (
    storeAssistantLoggedIn &&
    storeAssistantRole === 'store-assistant'
  ) {

    /*
     * IMPORTANT
     *
     * Store Assistant ko route se block nahi karenge.
     *
     * Page khulega aur page khud check karega
     * ki permission hai ya nahi.
     *
     * Isse unauthorized page par:
     *
     * Access Denied
     *
     * dikhaya ja sakta hai.
     */

    return true;

  }


  // ==================================================
  // NO ADMIN / NO STORE ASSISTANT LOGIN
  // ==================================================

  return router.createUrlTree([
    '/login'
  ]);

};