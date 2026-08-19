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


  // ==========================================
  // STATISTICS
  // ==========================================

  totalOrders = 0;

  pendingOrders = 0;

  deliveredOrders = 0;

  cancelledOrders = 0;

  totalSales = 0;


  // ==========================================
  // RECENT ORDERS
  // ==========================================

  recentOrders: Order[] = [];


  constructor(

    private orderService: OrderService,

    private router: Router

  ) {

    this.loadDashboard();

  }


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  loadDashboard(): void {

    this.orderService
      .getOrders()
      .subscribe({

        next: (orders: Order[]) => {

          // ==================================
          // TOTAL ORDERS
          // ==================================

          this.totalOrders =
            orders.length;


          // ==================================
          // PENDING ORDERS
          // ==================================

          this.pendingOrders =
            orders.filter(

              order =>
                order.status !== 'Delivered' &&
                order.status !== 'Cancelled'

            ).length;


          // ==================================
          // DELIVERED ORDERS
          // ==================================

          this.deliveredOrders =
            orders.filter(

              order =>
                order.status === 'Delivered'

            ).length;


          // ==================================
          // CANCELLED ORDERS
          // ==================================

          this.cancelledOrders =
            orders.filter(

              order =>
                order.status === 'Cancelled'

            ).length;


          // ==================================
          // TOTAL SALES
          // CANCELLED ORDERS EXCLUDED
          // ==================================

          this.totalSales =
            orders

              .filter(

                order =>
                  order.status !== 'Cancelled'

              )

              .reduce(

                (total, order) =>

                  total +
                  Number(order.total || 0),

                0

              );


          // ==================================
          // RECENT ORDERS
          // ==================================

          this.recentOrders =

            [...orders]

              .sort(

                (a, b) =>
                  Number(b.id) -
                  Number(a.id)

              )

              .slice(0, 5);

        },


        error: (error) => {

          console.error(
            'Admin dashboard orders error:',
            error
          );

        }

      });

  }


  // ==========================================
  // VIEW ORDER
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
  // GET STATUS CLASS
  // ==========================================

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


 logout(): void {

  const confirmLogout =
    confirm(
      'Are you sure you want to logout?'
    );


  if (!confirmLogout) {

    return;

  }


  // ADMIN LOGIN CLEAR

  localStorage.removeItem(
    'adminLoggedIn'
  );


  // STORE ASSISTANT LOGIN CLEAR

  localStorage.removeItem(
    'storeAssistantLoggedIn'
  );


  // ROLE CLEAR

  localStorage.removeItem(
    'adminRole'
  );


  // GO TO STAFF LOGIN

  this.router.navigate([
    '/admin-login'
  ]);

}
}