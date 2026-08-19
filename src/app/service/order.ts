import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import { Order } from '../order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl =
    'http://localhost:3000/api/orders';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET ALL ORDERS
  // ==========================================

  getOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(
      this.apiUrl
    );

  }


  // ==========================================
  // GET ORDER BY ID
  // ==========================================

  getOrderById(
    id: number
  ): Observable<Order> {

    return this.http.get<Order>(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // GET ORDERS BY USER EMAIL
  // ==========================================

  getOrdersByUser(
    email: string
  ): Observable<Order[]> {

    return this.http.get<Order[]>(

      `${this.apiUrl}/user/email/${encodeURIComponent(email)}`

    );

  }


  // ==========================================
  // ADD ORDER
  // ==========================================

  addOrder(
    order: Order
  ): Observable<any> {

    return this.http.post<any>(

      this.apiUrl,

      order

    );

  }


  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  updateOrderStatus(

    id: number,

    status: string

  ): Observable<any> {

    return this.http.patch<any>(

      `${this.apiUrl}/${id}/status`,

      {
        status: status
      }

    );

  }


  // ==========================================
  // CANCEL ORDER
  // ==========================================

  cancelOrder(
    id: number
  ): Observable<any> {

    return this.http.patch<any>(

      `${this.apiUrl}/${id}/status`,

      {
        status: 'Cancelled'
      }

    );

  }


  // ==========================================
  // DELETE ORDER
  // ==========================================

  deleteOrder(
    id: number
  ): Observable<any> {

    return this.http.delete<any>(

      `${this.apiUrl}/${id}`

    );

  }

}