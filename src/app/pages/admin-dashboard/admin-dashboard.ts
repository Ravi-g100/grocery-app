import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { Order } from '../../order';

import { OrderService } from '../../service/order';


@Component({

  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './admin-dashboard.html',

  styleUrl: './admin-dashboard.css'

})
export class AdminDashboardComponent {


  // ==================================================
  // ACCESS CONTROL
  // ==================================================

  isAdmin = false;

  isStoreAssistant = false;


  hasDashboardAccess = false;

  hasOrdersAccess = false;

  hasProductsAccess = false;

  hasCategoriesAccess = false;

  hasUsersAccess = false;


  // ==================================================
  // STATISTICS
  // ==================================================

  totalOrders = 0;

  pendingOrders = 0;

  deliveredOrders = 0;

  cancelledOrders = 0;

  totalSales = 0;


  // ==================================================
  // RECENT ORDERS
  // ==================================================

  recentOrders: Order[] = [];


  // ==================================================
  // CONSTRUCTOR
  // ==================================================

  constructor(

    private orderService: OrderService,

    private router: Router

  ) {

    this.checkAccess();

  }


  // ==================================================
  // CHECK ACCESS
  // ==================================================

  checkAccess(): void {


    // ==================================================
    // ADMIN LOGIN
    // ==================================================

    this.isAdmin =
      localStorage.getItem(
        'adminLoggedIn'
      ) === 'true' &&

      localStorage.getItem(
        'adminRole'
      ) === 'admin';


    // ==================================================
    // STORE ASSISTANT LOGIN
    // ==================================================

    this.isStoreAssistant =
      localStorage.getItem(
        'storeAssistantLoggedIn'
      ) === 'true' &&

      localStorage.getItem(
        'storeAssistantRole'
      ) === 'store-assistant';


    // ==================================================
    // ADMIN FULL ACCESS
    // ==================================================

    if (this.isAdmin) {

      this.hasDashboardAccess = true;

      this.hasOrdersAccess = true;

      this.hasProductsAccess = true;

      this.hasCategoriesAccess = true;

      this.hasUsersAccess = true;


      this.loadDashboard();

      return;

    }


    // ==================================================
    // STORE ASSISTANT
    // ==================================================

    if (this.isStoreAssistant) {


      const permissionsString =
        localStorage.getItem(
          'storeAssistantPermissions'
        );


      // ==================================================
      // NO PERMISSION DATA
      // ==================================================

      if (!permissionsString) {

        this.hasDashboardAccess = false;

        this.hasOrdersAccess = false;

        this.hasProductsAccess = false;

        this.hasCategoriesAccess = false;

        this.hasUsersAccess = false;

        return;

      }


      // ==================================================
      // READ PERMISSIONS
      // ==================================================

      try {

        const permissions =
          JSON.parse(
            permissionsString
          );


        this.hasDashboardAccess =
          permissions.dashboard === true;


        this.hasOrdersAccess =
          permissions.orders === true;


        this.hasProductsAccess =
          permissions.products === true;


        this.hasCategoriesAccess =
          permissions.categories === true;


        this.hasUsersAccess =
          permissions.users === true;


        // ==================================================
        // LOAD DASHBOARD DATA ONLY IF ACCESS IS GIVEN
        // ==================================================

        if (
          this.hasDashboardAccess
        ) {

          this.loadDashboard();

        }

      }
      catch (error) {

        console.error(
          'Dashboard permission parse error:',
          error
        );


        this.hasDashboardAccess = false;

        this.hasOrdersAccess = false;

        this.hasProductsAccess = false;

        this.hasCategoriesAccess = false;

        this.hasUsersAccess = false;

      }


      return;

    }


    // ==================================================
    // NOT LOGGED IN
    // ==================================================

    this.router.navigate([
      '/admin-login'
    ]);

  }


  // ==================================================
  // LOAD DASHBOARD
  // ==================================================

  loadDashboard(): void {

    this.orderService
      .getOrders()
      .subscribe({

        next: (orders: Order[]) => {


          // ==================================================
          // TOTAL ORDERS
          // ==================================================

          this.totalOrders =
            orders.length;


          // ==================================================
          // PENDING ORDERS
          // ==================================================

          this.pendingOrders =
            orders.filter(

              order =>

                order.status !== 'Delivered' &&

                order.status !== 'Cancelled'

            ).length;


          // ==================================================
          // DELIVERED ORDERS
          // ==================================================

          this.deliveredOrders =
            orders.filter(

              order =>

                order.status === 'Delivered'

            ).length;


          // ==================================================
          // CANCELLED ORDERS
          // ==================================================

          this.cancelledOrders =
            orders.filter(

              order =>

                order.status === 'Cancelled'

            ).length;


          // ==================================================
          // TOTAL SALES
          // ==================================================

          this.totalSales =

            orders

              .filter(

                order =>

                  order.status !== 'Cancelled'

              )

              .reduce(

                (total, order) =>

                  total +
                  Number(
                    order.total || 0
                  ),

                0

              );


          // ==================================================
          // RECENT ORDERS
          // ==================================================

          this.recentOrders =

            [...orders]

              .sort(

                (a, b) =>

                  Number(b.id) -

                  Number(a.id)

              )

              .slice(
                0,
                5
              );

        },


        error: (error) => {

          console.error(
            'Admin dashboard orders error:',
            error
          );

        }

      });

  }


  // ==================================================
  // VIEW ORDER
  // ==================================================

  viewOrder(
    id: number
  ): void {

    this.router.navigate([
      '/order-details',
      id
    ]);

  }


  // ==================================================
  // GET STATUS CLASS
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


  // ==================================================
  // LOGOUT
  // ==================================================

  logout(): void {


    const confirmLogout =
      confirm(
        'Are you sure you want to logout?'
      );


    if (!confirmLogout) {

      return;

    }


    // ==================================================
    // CLEAR ADMIN LOGIN
    // ==================================================

    localStorage.removeItem(
      'adminLoggedIn'
    );

    localStorage.removeItem(
      'adminRole'
    );


    // ==================================================
    // CLEAR STORE ASSISTANT LOGIN
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

    localStorage.removeItem(
      'storeAssistantUser'
    );


    // ==================================================
    // GO TO ADMIN LOGIN
    // ==================================================

    this.router.navigate([
      '/admin-login'
    ]);

  }

}

