import { Injectable } from '@angular/core';

import { Cart } from '../cart';
import { Product } from '../models/product';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: Cart[] = [];


  constructor() {

    const data =
      localStorage.getItem('cart');


    if (data) {

      try {

        this.cartItems =
          JSON.parse(data);

      } catch {

        this.cartItems = [];

      }

    }

  }


  // ==========================================
  // SAVE CART
  // ==========================================

  private saveCart(): void {

    localStorage.setItem(
      'cart',
      JSON.stringify(this.cartItems)
    );

  }


  // ==========================================
  // ADD TO CART
  // ==========================================

  addToCart(
    product: Product
  ): boolean {

    const item =
      this.cartItems.find(
        x =>
          x.product.id ===
          product.id
      );


    // ========================================
    // PRODUCT ALREADY IN CART
    // ========================================

    if (item) {

      if (
        item.quantity >=
        product.stock
      ) {

        alert(
          `Only ${product.stock} item(s) available in stock.`
        );

        return false;

      }


      item.quantity++;

    }


    // ========================================
    // PRODUCT NOT IN CART
    // ========================================

    else {

      if (
        product.stock <= 0
      ) {

        alert(
          'Product is Out of Stock.'
        );

        return false;

      }


      this.cartItems.push({

        product:
          product,

        quantity:
          1

      });

    }


    this.saveCart();

    return true;

  }


  // ==========================================
  // GET CART ITEMS
  // ==========================================

  getCartItems(): Cart[] {

    return this.cartItems;

  }


  // ==========================================
  // REMOVE ITEM
  // ==========================================

  removeItem(
    productId: number
  ): void {

    this.cartItems =
      this.cartItems.filter(

        item =>
          Number(item.product.id) !==
          Number(productId)

      );


    this.saveCart();

  }


  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  increaseQuantity(
    productId: number
  ): boolean {

    const item =
      this.cartItems.find(

        x =>
          Number(x.product.id) ===
          Number(productId)

      );


    if (!item) {

      return false;

    }


    // ========================================
    // STOCK LIMIT
    // ========================================

    if (
      item.quantity >=
      item.product.stock
    ) {

      alert(
        `Only ${item.product.stock} item(s) available in stock.`
      );

      return false;

    }


    item.quantity++;

    this.saveCart();

    return true;

  }


  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  decreaseQuantity(
    productId: number
  ): void {

    const item =
      this.cartItems.find(

        x =>
          Number(x.product.id) ===
          Number(productId)

      );


    if (!item) {

      return;

    }


    if (
      item.quantity > 1
    ) {

      item.quantity--;

      this.saveCart();

    }

  }


  // ==========================================
  // CLEAR CART
  // ==========================================

  clearCart(): void {

    this.cartItems = [];


    localStorage.removeItem(
      'cart'
    );

  }

}