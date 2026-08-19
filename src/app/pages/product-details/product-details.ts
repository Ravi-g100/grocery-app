import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';


@Component({
  selector: 'app-product-details',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './product-details.html',

  styleUrl: './product-details.css'
})
export class ProductDetails {

  product!: Product;

  loading = true;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );


    this.loadProduct(id);

  }


  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  loadProduct(
    id: number
  ): void {

    this.productService
      .getProductById(id)
      .subscribe({

        next: (product) => {

          this.product =
            product;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Product details error:',
            error
          );

          this.loading = false;

          alert(
            'Product not found.'
          );

        }

      });

  }


  // ==========================================
  // ADD TO CART
  // ==========================================

  addToCart(): void {

    if (!this.product) {

      return;

    }


    this.cartService
      .addToCart(this.product);


    alert(
      'Product Added To Cart'
    );

  }

}