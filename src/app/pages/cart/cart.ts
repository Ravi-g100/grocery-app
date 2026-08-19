import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import { CartService } from '../../services/cart';

import { OrderService } from '../../service/order';

import { UserService } from '../../services/user';

import {
  Order,
  OrderItem
} from '../../order';


@Component({

  selector: 'app-cart',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './cart.html',

  styleUrl: './cart.css'

})
export class CartComponent {


  // ==========================================
  // CART ITEMS
  // ==========================================

  cartItems: any[] = [];


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private cartService:
      CartService,

    private orderService:
      OrderService,

    private userService:
      UserService,

    private router:
      Router

  ) {

    this.loadCart();

  }


  // ==========================================
  // LOAD CART
  // ==========================================

  loadCart(): void {

    this.cartItems =
      this.cartService.getCartItems();

  }


  // ==========================================
  // INCREASE QUANTITY
  // HTML: increase(item)
  // ==========================================

  increase(
    item: any
  ): void {

    const success =
      this.cartService.increaseQuantity(
        Number(item.product.id)
      );

    if (success) {

      this.loadCart();

    }

  }


  // ==========================================
  // DECREASE QUANTITY
  // HTML: decrease(item)
  // ==========================================

  decrease(
    item: any
  ): void {

    this.cartService.decreaseQuantity(
      Number(item.product.id)
    );

    this.loadCart();

  }


  // ==========================================
  // REMOVE ITEM
  // HTML: remove(item)
  // ==========================================

  remove(
    item: any
  ): void {

    this.cartService.removeItem(
      Number(item.product.id)
    );

    this.loadCart();

  }


  // ==========================================
  // OLD METHOD SUPPORT
  // ==========================================

  increaseQuantity(
    item: any
  ): void {

    this.increase(item);

  }


  decreaseQuantity(
    item: any
  ): void {

    this.decrease(item);

  }


  removeItem(
    item: any
  ): void {

    this.remove(item);

  }


  // ==========================================
  // CLEAR CART
  // ==========================================

  clearCart(): void {

    if (
      this.cartItems.length === 0
    ) {

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to clear the cart?'
      );


    if (!confirmed) {

      return;

    }


    this.cartService.clearCart();

    this.loadCart();

  }


  // ==========================================
  // GET TOTAL
  // ==========================================

  getTotal(): number {

    return this.cartItems.reduce(

      (
        total,
        item
      ) =>

        total +

        (
          Number(item.product.price) *
          Number(item.quantity)
        ),

      0

    );

  }


  // ==========================================
  // CHECKOUT
  // ==========================================

  checkout(): void {

    if (
      this.cartItems.length === 0
    ) {

      alert(
        'Your Cart is Empty.'
      );

      return;

    }


    const email =
      localStorage.getItem(
        'currentUser'
      );


    if (!email) {

      alert(
        'Please login first.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // ========================================
    // GET LOGGED-IN USER
    // ========================================

    this.userService
      .getUserByEmail(email)
      .subscribe({

        next: (user) => {

          if (
            !user ||
            !user.id
          ) {

            alert(
              'User information not found.'
            );

            return;

          }


          // ==================================
          // CREATE ORDER ITEMS
          // ==================================

          const items: OrderItem[] =

            this.cartItems.map(

              item => ({

                product:
                  item.product,

                product_id:
                  Number(
                    item.product.id
                  ),

                quantity:
                  Number(
                    item.quantity
                  ),

                price:
                  Number(
                    item.product.price
                  )

              })

            );


          // ==================================
          // CREATE ORDER
          // ==================================

          const order: Order = {

            id:
              Date.now(),

            user_id:
              Number(user.id),

            date:
              new Date()
                .toISOString(),

            items:
              items,

            total:
              this.getTotal(),

            payment:
              'COD',

            status:
              'Order Placed',

            fullname:
              user.fullname,

            mobile:
              user.mobile,

            email:
              user.email,

            address:
              user.address || '',

            city:
              user.city || '',

            pincode:
              user.pincode || ''

          };


          // ==================================
          // SAVE ORDER TO BACKEND
          // ==================================

          this.orderService
            .addOrder(order)
            .subscribe({

              next: (response) => {

                console.log(
                  'Order created successfully:',
                  response
                );


                // ============================
                // CLEAR CART
                // ============================

                this.cartService
                  .clearCart();

                this.loadCart();


                // ============================
                // SUCCESS
                // ============================

                alert(
                  'Order Placed Successfully! 🎉'
                );


                this.router.navigate([
                  '/order-success'
                ]);

              },


              error: (error) => {

                console.error(
                  'Create order error:',
                  error
                );


                alert(

                  error?.error?.message ||

                  'Order create nahi hua.'

                );

              }

            });

        },


        error: (error) => {

          console.error(
            'Get user error:',
            error
          );


          alert(
            'User information could not be loaded.'
          );

        }

      });

  }


  // ==========================================
  // GO TO PRODUCTS
  // ==========================================

  continueShopping(): void {

    this.router.navigate([
      '/products'
    ]);

  }


  // ==========================================
  // CART COUNT
  // ==========================================

  getCartCount(): number {

    return this.cartItems.reduce(

      (
        count,
        item
      ) =>

        count +
        Number(item.quantity),

      0

    );

  }

}