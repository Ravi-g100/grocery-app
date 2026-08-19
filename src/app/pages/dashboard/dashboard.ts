import { Component } from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  UserService
} from '../../services/user';

import {
  OrderService
} from '../../service/order';

import {
  CartService
} from '../../services/cart';

import {
  WishlistService
} from '../../services/wishlist';

import {
  Order
} from '../../order';
import { CommonModule } from '@angular/common';


@Component({

  selector: 'app-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'

})
export class Dashboard {

  // ==========================================
  // USER NAME
  // ==========================================

  userName = 'User';


  // ==========================================
  // USER EMAIL
  // ==========================================

  userEmail = '';


  // ==========================================
  // TOTAL ORDERS
  // ==========================================

  totalOrders = 0;


  // ==========================================
  // CART ITEMS
  // ==========================================

  cartItems = 0;


  // ==========================================
  // WISHLIST ITEMS
  // ==========================================

  wishlistItems = 0;


  // ==========================================
  // RECENT ORDERS
  // ==========================================

  recentOrders: Order[] = [];


  constructor(

    private userService: UserService,

    private orderService: OrderService,

    private cartService: CartService,

    private wishlistService: WishlistService,

    private router: Router

  ) {

    this.loadUser();

  }


  // ==========================================
  // LOAD CURRENT USER
  // ==========================================

  loadUser(): void {

    const email =
      localStorage.getItem(
        'currentUser'
      );


    // ========================================
    // USER NOT LOGGED IN
    // ========================================

    if (!email) {

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    this.userEmail =
      email;


    // ========================================
    // GET USER FROM BACKEND
    // ========================================

    this.userService
      .getUserByEmail(email)
      .subscribe({

        next: (user) => {

          this.userName =
            user.fullname || 'User';

        },


        error: (error) => {

          console.error(
            'Get user error:',
            error
          );

          localStorage.removeItem(
            'currentUser'
          );

          this.router.navigate([
            '/login'
          ]);

        }

      });


    // ========================================
    // LOAD ORDERS
    // ========================================

    this.loadOrders();


    // ========================================
    // LOAD CART
    // ========================================

    this.loadCart();


    // ========================================
    // LOAD WISHLIST
    // ========================================

    this.loadWishlist();

  }


  // ==========================================
  // LOAD USER ORDERS
  // ==========================================

  loadOrders(): void {

    if (!this.userEmail) {

      return;

    }


    this.orderService
      .getOrdersByUser(this.userEmail)
      .subscribe({

        next: (orders: Order[]) => {

          const allOrders =
            orders || [];


          // ==================================
          // TOTAL ORDERS
          // ==================================

          this.totalOrders =
            allOrders.length;


          // ==================================
          // RECENT ORDERS
          // ==================================

          this.recentOrders =
            allOrders
              .slice(0, 5);

        },


        error: (error) => {

          console.error(
            'Dashboard orders error:',
            error
          );


          this.totalOrders =
            0;

          this.recentOrders =
            [];

        }

      });

  }


  // ==========================================
  // LOAD CART
  // ==========================================

  loadCart(): void {

    try {

      const cart =
        this.cartService.cartItems || [];


      this.cartItems =
        cart.reduce(

          (total: number, item: any) => {

            return total +
              Number(
                item.quantity || 0
              );

          },

          0

        );

    } catch (error) {

      console.error(
        'Dashboard cart error:',
        error
      );

      this.cartItems =
        0;

    }

  }


  // ==========================================
  // LOAD WISHLIST
  // ==========================================

  loadWishlist(): void {

    try {

      const wishlist =
        this.wishlistService.getWishlist();


      if (Array.isArray(wishlist)) {

        this.wishlistItems =
          wishlist.length;

      } else {

        this.wishlistItems =
          0;

      }

    } catch (error) {

      console.error(
        'Dashboard wishlist error:',
        error
      );

      this.wishlistItems =
        0;

    }

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    const confirmLogout =
      confirm(
        'Are you sure you want to logout?'
      );


    if (!confirmLogout) {

      return;

    }


    // ========================================
    // REMOVE USER LOGIN
    // ========================================

    localStorage.removeItem(
      'currentUser'
    );


    // ========================================
    // GO LOGIN
    // ========================================

    this.router.navigate([
      '/login'
    ]);

  }

}