import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  // ==========================================
  // WISHLIST
  // ==========================================

  wishlist: Product[] = [];


  constructor() {

    this.loadWishlist();

  }


  // ==========================================
  // LOAD WISHLIST
  // ==========================================

  private loadWishlist(): void {

    const data =
      localStorage.getItem('wishlist');


    if (!data) {

      this.wishlist = [];

      return;

    }


    try {

      const savedWishlist =
        JSON.parse(data);


      if (Array.isArray(savedWishlist)) {

        this.wishlist =
          savedWishlist;

      }
      else {

        this.wishlist = [];

        localStorage.removeItem(
          'wishlist'
        );

      }

    }
    catch {

      this.wishlist = [];

      localStorage.removeItem(
        'wishlist'
      );

    }

  }


  // ==========================================
  // SAVE WISHLIST
  // ==========================================

  private saveWishlist(): void {

    if (this.wishlist.length === 0) {

      localStorage.removeItem(
        'wishlist'
      );

      return;

    }


    localStorage.setItem(
      'wishlist',
      JSON.stringify(
        this.wishlist
      )
    );

  }


  // ==========================================
  // ADD TO WISHLIST
  // ==========================================

  add(product: Product): void {

    const exists =
      this.wishlist.some(
        x => x.id === product.id
      );


    if (exists) {

      return;

    }


    this.wishlist.push({
      ...product
    });


    this.saveWishlist();

  }


  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  remove(productId: number): void {

    this.wishlist =
      this.wishlist.filter(
        x => x.id !== productId
      );


    this.saveWishlist();

  }


  // ==========================================
  // CHECK WISHLIST
  // ==========================================

  isInWishlist(
    productId: number
  ): boolean {

    return this.wishlist.some(
      x => x.id === productId
    );

  }


  // ==========================================
  // GET WISHLIST
  // ==========================================

  getWishlist(): Product[] {

    return this.wishlist;

  }


  // ==========================================
  // WISHLIST COUNT
  // ==========================================

  getWishlistCount(): number {

    return this.wishlist.length;

  }


  // ==========================================
  // CLEAR WISHLIST
  // ==========================================

  clearWishlist(): void {

    this.wishlist = [];

    localStorage.removeItem(
      'wishlist'
    );

  }

}