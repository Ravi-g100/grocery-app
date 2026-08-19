import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import { Order } from '../../order';

import { OrderService } from '../../service/order';


@Component({

  selector:
    'app-order-details',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './order-details.html',

  styleUrl:
    './order-details.css'

})
export class OrderDetailsComponent {


  order: Order | undefined;


  constructor(

    private route:
      ActivatedRoute,

    private orderService:
      OrderService

  ) {

    this.loadOrder();

  }


  // ==========================================
  // LOAD ORDER
  // ==========================================

  loadOrder(): void {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );


    if (!id) {

      console.error(
        'Invalid order id'
      );

      this.order =
        undefined;

      return;

    }


    this.orderService
      .getOrderById(id)
      .subscribe({

        next: (order: any) => {

          console.log(
            'ORDER DETAILS RESPONSE:',
            order
          );


          this.order = {

            ...order,

            date:
              order.date ||
              order.order_date ||
              '',

            items:
              Array.isArray(order.items)
                ? order.items
                : []

          };

        },


        error: (error) => {

          console.error(
            'Get order error:',
            error
          );


          this.order =
            undefined;

        }

      });

  }


  // ==========================================
  // TRACKING STEPS
  // ==========================================

  getTrackingSteps(): string[] {

    return [

      'Order Placed',

      'Confirmed',

      'Shipped',

      'Out for Delivery',

      'Delivered'

    ];

  }


  // ==========================================
  // TRACKING STEP CLASS
  // ==========================================

  getStepClass(
    step: string
  ): string {

    if (!this.order) {

      return '';

    }


    if (
      this.order.status ===
      'Cancelled'
    ) {

      return 'cancelled';

    }


    const steps =
      this.getTrackingSteps();


    const currentIndex =
      steps.indexOf(
        this.order.status
      );


    const stepIndex =
      steps.indexOf(
        step
      );


    if (
      stepIndex < currentIndex
    ) {

      return 'completed';

    }


    if (
      stepIndex === currentIndex
    ) {

      return 'active';

    }


    return 'pending';

  }


  // ==========================================
  // CANCEL ORDER
  // ==========================================

  cancelOrder(): void {

    if (!this.order) {

      return;

    }


    if (
      this.order.status ===
      'Delivered'
    ) {

      alert(
        'Delivered order cannot be cancelled.'
      );

      return;

    }


    if (
      this.order.status ===
      'Cancelled'
    ) {

      alert(
        'This order is already cancelled.'
      );

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to cancel this order?'
      );


    if (!confirmed) {

      return;

    }


    this.orderService
      .cancelOrder(
        this.order.id
      )
      .subscribe({

        next: () => {

          if (this.order) {

            this.order.status =
              'Cancelled';

          }


          alert(
            'Order cancelled successfully.'
          );

        },


        error: (error) => {

          console.error(
            'Cancel order error:',
            error
          );


          alert(
            error?.error?.message ||
            'Unable to cancel this order.'
          );

        }

      });

  }

}