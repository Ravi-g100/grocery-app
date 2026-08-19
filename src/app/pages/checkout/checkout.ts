import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { CartService } from '../../services/cart';

import { ProductService } from '../../services/product';

import { OrderService } from '../../service/order';

import { UserService } from '../../services/user';

import { Order, OrderItem } from '../../order';


@Component({

  selector: 'app-checkout',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './checkout.html',

  styleUrl: './checkout.css'

})
export class CheckoutComponent {

  checkoutForm: FormGroup;


  constructor(

    private fb: FormBuilder,

    private router: Router,

    private cartService: CartService,

    private productService: ProductService,

    private orderService: OrderService,

    private userService: UserService

  ) {

    this.checkoutForm =
      this.fb.group({

        fullname: [
          '',
          Validators.required
        ],

        mobile: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[6-9][0-9]{9}$'
            )
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],

        address: [
          '',
          Validators.required
        ],

        city: [
          '',
          Validators.required
        ],

        pincode: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[0-9]{6}$'
            )
          ]
        ],

        payment: [
          'COD',
          Validators.required
        ]

      });


    this.loadUserData();

  }


  // ==========================================
  // LOAD USER DATA
  // ==========================================

  loadUserData(): void {

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


    this.userService
      .getUserByEmail(email)
      .subscribe({

        next: (user) => {

          if (!user) {

            alert(
              'User information not found.'
            );

            this.router.navigate([
              '/login'
            ]);

            return;

          }


          this.checkoutForm.patchValue({

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

          this.router.navigate([
            '/login'
          ]);

        }

      });

  }


  // ==========================================
  // PLACE ORDER
  // ==========================================

  placeOrder(): void {

    if (
      this.checkoutForm.invalid
    ) {

      this.checkoutForm.markAllAsTouched();

      return;

    }


    // ==========================================
    // GET CART
    // ==========================================

    const cartItems =
      this.cartService.getCartItems();


    if (
      cartItems.length === 0
    ) {

      alert(
        'Your Cart is Empty'
      );

      this.router.navigate([
        '/products'
      ]);

      return;

    }


    // ==========================================
    // CURRENT USER
    // ==========================================

    const loggedInEmail =
      localStorage.getItem(
        'currentUser'
      );


    if (!loggedInEmail) {

      alert(
        'Please login first.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    // ==========================================
    // GET USER ID
    // ==========================================

    this.userService
      .getUserByEmail(loggedInEmail)
      .subscribe({

        next: (user) => {

          if (!user || !user.id) {

            alert(
              'User information not found.'
            );

            return;

          }


          // ======================================
          // CHECK STOCK
          // ======================================

          this.checkStockAndPlaceOrder(
            cartItems,
            loggedInEmail,
            Number(user.id)
          );

        },


        error: (error) => {

          console.error(
            'Get user error:',
            error
          );

          alert(
            'Unable to get user information.'
          );

        }

      });

  }


  // ==========================================
  // CHECK STOCK
  // ==========================================

  private checkStockAndPlaceOrder(

    cartItems: any[],

    loggedInEmail: string,

    userId: number

  ): void {

    const checkNextProduct = (
      index: number
    ): void => {

      if (
        index >= cartItems.length
      ) {

        this.reduceAllStock(
          cartItems,
          loggedInEmail,
          userId
        );

        return;

      }


      const item =
        cartItems[index];


      this.productService
        .getProductById(
          Number(item.product.id)
        )
        .subscribe({

          next: (product) => {

            if (
              Number(product.stock) <
              Number(item.quantity)
            ) {

              alert(

                `${product.name} has only ${product.stock} item(s) available.`

              );

              return;

            }


            checkNextProduct(
              index + 1
            );

          },


          error: (error) => {

            console.error(
              'Stock check error:',
              error
            );

            alert(
              `${item.product.name} not found.`
            );

          }

        });

    };


    checkNextProduct(0);

  }


  // ==========================================
  // REDUCE ALL STOCK
  // ==========================================

  private reduceAllStock(

    cartItems: any[],

    loggedInEmail: string,

    userId: number

  ): void {

    const reduceNextProduct = (
      index: number
    ): void => {

      if (
        index >= cartItems.length
      ) {

        this.createOrder(
          cartItems,
          loggedInEmail,
          userId
        );

        return;

      }


      const item =
        cartItems[index];


      this.productService
        .reduceStock(

          Number(item.product.id),

          Number(item.quantity)

        )
        .subscribe({

          next: () => {

            reduceNextProduct(
              index + 1
            );

          },


          error: (error) => {

            console.error(
              'Stock update error:',
              error
            );

            alert(

              error?.error?.message ||

              `Stock update failed for ${item.product.name}.`

            );

          }

        });

    };


    reduceNextProduct(0);

  }


  // ==========================================
  // CREATE ORDER
  // ==========================================

  private createOrder(

    cartItems: any[],

    loggedInEmail: string,

    userId: number

  ): void {

    // ==========================================
    // TOTAL
    // ==========================================

    const total =
      cartItems.reduce(

        (
          sum,
          item
        ) =>

          sum +

          (
            Number(item.product.price) *
            Number(item.quantity)
          ),

        0

      );


    // ==========================================
    // ORDER ITEMS
    // ==========================================

   const items: OrderItem[] =
  cartItems.map(

    item => ({

      product:
        item.product,

      product_id:
        Number(item.product.id),

      quantity:
        Number(item.quantity),

      price:
        Number(item.product.price)

    })

  );


    // ==========================================
    // CREATE ORDER OBJECT
    // ==========================================

    const order: Order = {

      id:
        Date.now(),

      user_id:
        Number(userId),

      date:
        new Date().toISOString(),

      items:
        items,

      total:
        total,

      payment:
        this.checkoutForm.value.payment,

      status:
        'Order Placed',

      fullname:
        this.checkoutForm.value.fullname,

      mobile:
        this.checkoutForm.value.mobile,

      email:
        loggedInEmail,

      address:
        this.checkoutForm.value.address,

      city:
        this.checkoutForm.value.city,

      pincode:
        this.checkoutForm.value.pincode

    };


    // ==========================================
    // SAVE ORDER TO BACKEND
    // ==========================================

    this.orderService
      .addOrder(order)
      .subscribe({

        next: (response) => {

          console.log(
            'Order created:',
            response
          );


          // ====================================
          // CLEAR CART
          // ====================================

          this.cartService
            .clearCart();


          // ====================================
          // SUCCESS
          // ====================================

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

  }

}