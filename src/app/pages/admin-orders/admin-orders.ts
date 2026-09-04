import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink
} from '@angular/router';

import { OrderService } from '../../service/order';


@Component({

  selector: 'app-admin-orders',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './admin-orders.html',

  styleUrl: './admin-orders.css'

})

export class AdminOrdersComponent {

  orders: any[] = [];

  loading = false;


  // ==================================================
  // LOGIN / ACCESS
  // ==================================================

  isAdmin = false;

  isStoreAssistant = false;

  hasOrdersAccess = false;


  constructor(

    private orderService: OrderService,

    private router: Router

  ) {

    this.checkAccess();

  }


  // ==================================================
  // CHECK ADMIN / STORE ASSISTANT ACCESS
  // ==================================================

  checkAccess(): void {

    // ------------------------------------------
    // ADMIN
    // ------------------------------------------

    this.isAdmin =
      localStorage.getItem(
        'adminLoggedIn'
      ) === 'true' &&
      localStorage.getItem(
        'adminRole'
      ) === 'admin';


    // ------------------------------------------
    // STORE ASSISTANT
    // ------------------------------------------

    this.isStoreAssistant =
      localStorage.getItem(
        'storeAssistantLoggedIn'
      ) === 'true' &&
      localStorage.getItem(
        'storeAssistantRole'
      ) === 'store-assistant';


    // ------------------------------------------
    // ADMIN = FULL ACCESS
    // ------------------------------------------

    if (this.isAdmin) {

      this.hasOrdersAccess = true;

      this.loadOrders();

      return;

    }


    // ------------------------------------------
    // STORE ASSISTANT
    // ------------------------------------------

    if (this.isStoreAssistant) {

      const permissionsString =
        localStorage.getItem(
          'storeAssistantPermissions'
        );


      if (!permissionsString) {

        this.hasOrdersAccess = false;

        return;

      }


      try {

        const permissions =
          JSON.parse(
            permissionsString
          );


        this.hasOrdersAccess =
          permissions.orders === true;


        // --------------------------------------
        // ONLY LOAD ORDERS IF ACCESS GIVEN
        // --------------------------------------

        if (this.hasOrdersAccess) {

          this.loadOrders();

        }

      }
      catch (error) {

        console.error(
          'Permission parse error:',
          error
        );

        this.hasOrdersAccess = false;

      }


      return;

    }


    // ------------------------------------------
    // NO LOGIN
    // ------------------------------------------

    this.router.navigate([
      '/admin-login'
    ]);

  }


  // ==================================================
  // LOAD ORDERS FROM MYSQL
  // ==================================================

  loadOrders(): void {

    this.loading = true;


    this.orderService
      .getOrders()
      .subscribe({

        next: (orders: any[]) => {

          this.orders =
            orders || [];

          this.loading = false;

        },


        error: (error) => {

          this.loading = false;

          console.error(
            'Load orders error:',
            error
          );

          alert(
            'Orders load nahi ho rahe hain.'
          );

        }

      });

  }


  // ==================================================
  // TOTAL ORDERS
  // ==================================================

  get totalOrders(): number {

    return this.orders.length;

  }


  // ==================================================
  // PENDING ORDERS
  // ==================================================

  get pendingOrders(): number {

    return this.orders.filter(

      order =>

        order.status ===
        'Order Placed' ||

        order.status ===
        'Pending'

    ).length;

  }


  // ==================================================
  // DELIVERED ORDERS
  // ==================================================

  get deliveredOrders(): number {

    return this.orders.filter(

      order =>
        order.status ===
        'Delivered'

    ).length;

  }


  // ==================================================
  // CANCELLED ORDERS
  // ==================================================

  get cancelledOrders(): number {

    return this.orders.filter(

      order =>
        order.status ===
        'Cancelled'

    ).length;

  }


  // ==================================================
  // VIEW ORDER
  // ==================================================

  viewOrder(
    id: number
  ): void {

    console.log(
      'VIEW ORDER ID:',
      id
    );


    if (!id) {

      alert(
        'Invalid Order ID.'
      );

      return;

    }


    this.router.navigate([
      '/order-details',
      Number(id)
    ]);

  }


  // ==================================================
  // UPDATE STATUS
  // ==================================================

  updateStatus(

    order: any,

    status: string

  ): void {

    if (
      order.status === status
    ) {

      return;

    }


    // ----------------------------------------
    // CANCEL ORDER
    // ----------------------------------------

    if (
      status === 'Cancelled'
    ) {

      const confirmed =
        confirm(

          `Are you sure you want to cancel Order #${order.id}?`

        );


      if (!confirmed) {

        return;

      }


      this.orderService
        .cancelOrder(
          order.id
        )
        .subscribe({

          next: (response) => {

            console.log(
              'Cancel response:',
              response
            );


            alert(

              `Order #${order.id} cancelled successfully. Stock has been restored. ✅`

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


      return;

    }


    // ----------------------------------------
    // OTHER STATUS
    // ----------------------------------------

    this.orderService
      .updateOrderStatus(

        order.id,

        status

      )
      .subscribe({

        next: () => {

          alert(

            `Order #${order.id} status updated to ${status}.`

          );


          this.loadOrders();

        },


        error: (error) => {

          console.error(
            'Update status error:',
            error
          );


          alert(

            error?.error?.message ||

            'Order status update nahi hua.'

          );

        }

      });

  }


  // ==================================================
  // DELETE ORDER
  // ==================================================

  deleteOrder(
    id: number
  ): void {

    const confirmed =
      confirm(

        'Are you sure you want to delete this order?'

      );


    if (!confirmed) {

      return;

    }


    this.orderService
      .deleteOrder(id)
      .subscribe({

        next: (response) => {

          console.log(
            'Delete response:',
            response
          );


          alert(

            response?.stockRestored

              ? 'Order deleted successfully. Stock has been restored. ✅'

              : 'Cancelled order deleted successfully. ✅'

          );


          this.loadOrders();

        },


        error: (error) => {

          console.error(
            'Delete order error:',
            error
          );


          alert(

            error?.error?.message ||

            'Order delete nahi hua.'

          );

        }

      });

  }


  // ==================================================
  // STATUS CSS
  // ==================================================

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'Order Placed':

      case 'Pending':

        return 'status-pending';


      case 'Confirmed':

        return 'status-confirmed';


      case 'Shipped':

        return 'status-shipped';


      case 'Out for Delivery':

        return 'status-out';


      case 'Delivered':

        return 'status-delivered';


      case 'Cancelled':

        return 'status-cancelled';


      default:

        return 'status-pending';

    }

  }

}