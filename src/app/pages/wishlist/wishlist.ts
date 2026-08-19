import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product';
import { WishlistService } from '../../services/wishlist';
import { CartService } from '../../services/cart';
import { PageNavigation } from '../../shared/page-navigations/page-navigations';

@Component({
  selector: 'app-wishlist',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,

  ],

  templateUrl: './wishlist.html',

  styleUrl: './wishlist.css'
})
export class WishlistComponent {

  // ==========================================
  // WISHLIST PRODUCTS
  // ==========================================

  wishlist: Product[] = [];


  constructor(
    public wishlistService: WishlistService,
    private cartService: CartService
  ) {

    this.loadWishlist();

  }


  // ==========================================
  // LOAD WISHLIST
  // ==========================================

  loadWishlist(): void {

    this.wishlist =
      this.wishlistService.getWishlist() || [];

  }


  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================

  remove(product: Product): void {

    this.wishlistService.remove(
      product.id
    );

    this.loadWishlist();

  }


  // ==========================================
  // ADD TO CART
  // ==========================================

  addToCart(product: Product): void {

    this.cartService.addToCart(
      product
    );

    alert(
      product.name +
      ' Added To Cart'
    );

  }

}