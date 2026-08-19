import {
  CanActivateFn,
  Router
} from '@angular/router';

import { inject } from '@angular/core';


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
  // NO LOGIN
  // ==================================================

  if (
    !adminLoggedIn &&
    !storeAssistantLoggedIn
  ) {

    return router.createUrlTree([
      '/admin-login'
    ]);

  }


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


    // ==================================================
    // GET PERMISSIONS
    // ==================================================

    const permissionsString =
      localStorage.getItem(
        'storeAssistantPermissions'
      );


    if (!permissionsString) {

      alert(
        'No permissions assigned by Admin.'
      );


      return router.createUrlTree([
        '/store-assistant-login'
      ]);

    }


    let permissions: any;


    try {

      permissions =
        JSON.parse(
          permissionsString
        );

    }
    catch (error) {

      console.error(
        'Permission parse error:',
        error
      );


      localStorage.removeItem(
        'storeAssistantPermissions'
      );


      return router.createUrlTree([
        '/store-assistant-login'
      ]);

    }


    // ==================================================
    // CURRENT URL
    // ==================================================

    const url =
      state.url;


    // ==================================================
    // DASHBOARD
    // ==================================================

    if (
      url === '/admin-dashboard' ||
      url.startsWith(
        '/admin-dashboard/'
      )
    ) {

      if (
        permissions.dashboard === true
      ) {

        return true;

      }

    }


    // ==================================================
    // ORDERS
    // ==================================================

    if (
      url === '/admin-orders' ||
      url.startsWith(
        '/admin-orders/'
      )
    ) {

      if (
        permissions.orders === true
      ) {

        return true;

      }

    }


    // ==================================================
    // PRODUCTS
    // ==================================================

    if (
      url === '/admin-products' ||
      url.startsWith(
        '/admin-products/'
      )
    ) {

      if (
        permissions.products === true
      ) {

        return true;

      }

    }


    // ==================================================
    // CATEGORIES
    // ==================================================

    if (
      url === '/admin-categories' ||
      url.startsWith(
        '/admin-categories/'
      )
    ) {

      if (
        permissions.categories === true
      ) {

        return true;

      }

    }


    // ==================================================
    // USERS
    // ==================================================

    if (
      url === '/admin-users' ||
      url.startsWith(
        '/admin-users/'
      )
    ) {

      if (
        permissions.users === true
      ) {

        return true;

      }

    }


    // ==================================================
    // ACCESS DENIED
    // ==================================================

    alert(
      'Access denied. Admin has not given you permission for this section.'
    );


    // ==================================================
    // FIND AN ALLOWED PAGE
    // ==================================================

    if (
      permissions.dashboard === true
    ) {

      return router.createUrlTree([
        '/admin-dashboard'
      ]);

    }


    if (
      permissions.orders === true
    ) {

      return router.createUrlTree([
        '/admin-orders'
      ]);

    }


    if (
      permissions.products === true
    ) {

      return router.createUrlTree([
        '/admin-products'
      ]);

    }


    if (
      permissions.categories === true
    ) {

      return router.createUrlTree([
        '/admin-categories'
      ]);

    }


    if (
      permissions.users === true
    ) {

      return router.createUrlTree([
        '/admin-users'
      ]);

    }


    // ==================================================
    // NOTHING ALLOWED
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


    return router.createUrlTree([
      '/store-assistant-login'
    ]);

  }


  // ==================================================
  // DEFAULT DENY
  // ==================================================

  return router.createUrlTree([
    '/admin-login'
  ]);

};