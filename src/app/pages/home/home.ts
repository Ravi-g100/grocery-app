import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  Router
} from '@angular/router';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { ProductCard } from '../../shared/product-card/product-card';


@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule,
    ProductCard,
    RouterLink
  ],

  templateUrl: './home.html',

  styleUrl: './home.css'
})
export class Home {

  // =========================
  // PRODUCTS
  // =========================

  products: Product[] = [];


  // =========================
  // CATEGORIES
  // =========================

  categories = [

    {
      name: 'Atta',
      icon: '🌾'
    },

    {
      name: 'Rice',
      icon: '🍚'
    },

    {
      name: 'Dal',
      icon: '🫘'
    },

    {
      name: 'Oil',
      icon: '🛢️'
    },

    {
      name: 'Tea',
      icon: '☕'
    },

    {
      name: 'Biscuits',
      icon: '🍪'
    },

    {
      name: 'Soap',
      icon: '🧼'
    },

    {
      name: 'Personal Care',
      icon: '🪥'
    }

  ];


  constructor(

    private productService: ProductService,

    private cartService: CartService,

    private router: Router

  ) {

    this.loadProducts();

  }


  // =========================
  // LOAD PRODUCTS
  // =========================

  loadProducts(): void {

    this.productService
      .getProducts()
      .subscribe({

        next: (products) => {

          this.products =
            products;

        },

        error: (error) => {

          console.error(
            'Products load error:',
            error
          );

          alert(
            'Products load nahi ho rahe hain.'
          );

        }

      });

  }


  // =========================
  // ADD TO CART
  // =========================

  addToCart(
    product: Product
  ): void {

    // =========================================
    // CHECK USER / ADMIN LOGIN
    // =========================================

    const currentUser =
      localStorage.getItem(
        'currentUser'
      );

    const adminLoggedIn =
      sessionStorage.getItem(
        'adminLoggedIn'
      );


    // =========================================
    // NOT LOGGED IN
    // =========================================

    if (
      !currentUser &&
      adminLoggedIn !== 'true'
    ) {

      alert(
        'Please login first to add products to cart.'
      );


      this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl: '/home'
          }
        }
      );


      return;

    }


    // =========================================
    // STOCK CHECK
    // =========================================

    if (
      Number(product.stock) <= 0
    ) {

      alert(
        `${product.name} is out of stock.`
      );

      return;

    }


    // =========================================
    // ADD TO CART
    // =========================================

    this.cartService
      .addToCart(product);


    alert(
      product.name +
      ' Added Successfully'
    );

  }

}