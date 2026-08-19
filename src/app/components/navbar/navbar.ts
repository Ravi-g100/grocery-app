import { Component } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-navbar',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  // =========================
  // LOGIN STATUS
  // =========================

  isLoggedIn = false;

  isUserLoggedIn = false;


  // =========================
  // LOGGED IN NAME
  // =========================

  loggedInName = '';


  // =========================
  // SEARCH
  // =========================

  searchText = '';


  constructor(

    private router: Router,

    private cartService: CartService,

    public wishlistService: WishlistService,

    private userService: UserService

  ) {

    this.checkLogin();

  }


  // =========================
  // CHECK LOGIN
  // =========================

  checkLogin(): void {

    const currentUser =
      sessionStorage.getItem(
        'currentUser'
      );


    const adminLoggedIn =
      sessionStorage.getItem(
        'adminLoggedIn'
      );


    // =========================
    // USER
    // =========================

    if (currentUser) {

      this.isLoggedIn = true;

      this.isUserLoggedIn = true;

      this.loggedInName = 'User';


      this.userService
        .getUserByEmail(currentUser)
        .subscribe({

          next: (user) => {

            if (user) {

              this.loggedInName =
                user.fullname;

            }

            else {

              this.loggedInName =
                'User';

            }

          },

          error: (error) => {

            console.error(
              'Get current user error:',
              error
            );

            this.loggedInName =
              'User';

          }

        });

      return;

    }


    // =========================
    // ADMIN
    // =========================

    if (
      adminLoggedIn === 'true'
    ) {

      this.isLoggedIn = true;

      this.isUserLoggedIn = false;

      this.loggedInName =
        'Admin';

      return;

    }


    // =========================
    // NOT LOGGED IN
    // =========================

    this.isLoggedIn = false;

    this.isUserLoggedIn = false;

    this.loggedInName = '';

  }


  // =========================
  // SEARCH PRODUCTS
  // =========================

  searchProducts(): void {

    const search =
      this.searchText.trim();


    if (!search) {

      this.router.navigate([
        '/products'
      ]);

      return;

    }


    this.router.navigate(
      ['/products'],
      {
        queryParams: {
          search: search
        }
      }
    );

  }


  // =========================
  // CART COUNT
  // =========================

  getCartCount(): number {

    return this.cartService
      .getCartItems()
      .reduce(

        (total, item) =>
          total + item.quantity,

        0

      );

  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    sessionStorage.removeItem(
      'currentUser'
    );


    sessionStorage.removeItem(
      'adminLoggedIn'
    );


    localStorage.removeItem(
      'currentUser'
    );


    this.isLoggedIn = false;

    this.isUserLoggedIn = false;

    this.loggedInName = '';


    this.router.navigate([
      '/login'
    ]);

  }

}