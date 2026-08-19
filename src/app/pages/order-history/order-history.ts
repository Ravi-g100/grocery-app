import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import { OrderService } from '../../service/order';

import { Order } from '../../order';


@Component({

  selector: 'app-order-history',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './order-history.html',

  styleUrl: './order-history.css'

})
export class OrderHistoryComponent {


  // ==========================================
  // ORDERS
  // ==========================================

  orders: Order[] = [];


  // ==========================================
  // USER EMAIL
  // ==========================================

  userEmail = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private orderService:
      OrderService,

    private router:
      Router

  ) {

    this.loadOrders();

  }


  // ==========================================
  // LOAD LOGGED-IN USER ORDERS
  // ==========================================

  loadOrders(): void {

    const email =
      localStorage.getItem(
        'currentUser'
      );


    // ========================================
    // LOGIN CHECK
    // ========================================

    if (!email) {

      alert(
        'Please login first.'
      );

      this.router.navigate([
        '/login'
      ]);

      return;

    }


    this.userEmail =
      email;


    // ========================================
    // GET ORDERS FROM MYSQL
    // ========================================

    this.orderService
      .getOrdersByUser(
        email
      )
      .subscribe({

        next: (orders: any[]) => {

          console.log(
            'My Orders:',
            orders
          );


          // ==================================
          // PREVENT undefined items ERROR
          // ==================================

          this.orders =
            (orders || []).map(

              order => ({

                ...order,

                items:
                  Array.isArray(
                    order.items
                  )
                    ? order.items
                    : []

              })

            ) as Order[];

        },


        error: (error) => {

          console.error(
            'My orders API error:',
            error
          );


          this.orders = [];


          alert(
            'Orders load nahi ho rahe hain.'
          );

        }

      });

  }


  // ==========================================
  // VIEW ORDER DETAILS
  // ==========================================

  viewOrder(
    id: number
  ): void {

    this.router.navigate([
      '/order-details',
      id
    ]);

  }


  // ==========================================
  // TOTAL ORDERS
  // ==========================================

  getOrderCount(): number {

    return this.orders.length;

  }


  // ==========================================
  // CANCEL ORDER
  // ==========================================

  cancelOrder(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to cancel this order?'
      );


    if (!confirmed) {

      return;

    }


    this.orderService
      .cancelOrder(id)
      .subscribe({

        next: () => {

          alert(
            'Order cancelled successfully.'
          );


          this.loadOrders();

        },


        error: (error) => {

          console.error(
            'Cancel order error:',
            error
          );


          alert(
            error?.error?.message ||
            'Order cancel nahi hua.'
          );

        }

      });

  }

}