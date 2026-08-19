import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl =
    'http://localhost:3000/api/products';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // GET ALL PRODUCTS
  // ==========================================

  getProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(
      this.apiUrl
    );

  }


  // ==========================================
  // GET PRODUCT BY ID
  // ==========================================

  getProductById(
    id: number
  ): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // ADD PRODUCT
  // ==========================================

  addProduct(
    product: Product
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      product
    );

  }


  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  updateProduct(
    product: Product
  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/${product.id}`,

      product

    );

  }


  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  deleteProduct(
    id: number
  ): Observable<any> {

    return this.http.delete(

      `${this.apiUrl}/${id}`

    );

  }


  // ==========================================
  // REDUCE STOCK
  // ==========================================

  reduceStock(
    id: number,
    quantity: number
  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}/${id}/reduce-stock`,

      {
        quantity
      }

    );

  }


  // ==========================================
  // RESTORE STOCK
  // ==========================================

  restoreStock(
    id: number,
    quantity: number
  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}/${id}/restore-stock`,

      {
        quantity
      }

    );

  }

}