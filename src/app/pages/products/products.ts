import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RouterLink,
  ActivatedRoute,
  Router
} from '@angular/router';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';
import { CategoryService } from '../../services/category';


@Component({
  selector: 'app-products',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './products.html',

  styleUrl: './products.css'
})
export class Products {

  // ==========================================
  // ALL PRODUCTS
  // ==========================================

  products: Product[] = [];

  // ==========================================
  // FILTERED PRODUCTS
  // ==========================================

  filteredProducts: Product[] = [];

  // ==========================================
  // SEARCH
  // ==========================================

  searchText = '';

  // ==========================================
  // CATEGORY
  // ==========================================

  selectedCategory = 'All';

  categories: string[] = [];

  // ==========================================
  // PRICE FILTER
  // ==========================================

  minPrice: number | null = null;

  maxPrice: number | null = null;

  // ==========================================
  // PRICE SORT
  // ==========================================

  sortPrice = 'default';


  constructor(

    private productService: ProductService,

    private cartService: CartService,

    private wishlistService: WishlistService,

    private categoryService: CategoryService,

    private route: ActivatedRoute,

    private router: Router

  ) {

    this.loadProducts();

    this.loadCategories();


    // ==========================================
    // URL QUERY PARAMETERS
    // ==========================================

    this.route.queryParams.subscribe(params => {

      // CATEGORY

      const category =
        params['category'];

      if (category) {

        this.selectedCategory =
          category;

      } else {

        this.selectedCategory =
          'All';

      }


      // SEARCH

      const search =
        params['search'];

      if (search) {

        this.searchText =
          search;

      } else {

        this.searchText =
          '';

      }


      // APPLY FILTER

      this.filterProducts();

    });

  }


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  loadProducts(): void {

    this.productService
      .getProducts()
      .subscribe({

        next: (products) => {

          this.products =
            products;

          this.filteredProducts = [
            ...products
          ];

          this.filterProducts();

        },

        error: (error) => {

          console.error(
            'Products load failed:',
            error
          );

          alert(
            'Products load nahi ho rahe hain.'
          );

        }

      });

  }


  // ==========================================
  // LOAD CATEGORIES
  // ==========================================

  loadCategories(): void {

    this.categories = [

      'All',

      ...this.categoryService
        .getCategories()

    ];

  }


  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  filterProducts(): void {

    let result =
      [...this.products];


    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    if (
      this.selectedCategory !== 'All'
    ) {

      result =
        result.filter(product =>

          product.category
            ?.toLowerCase()
            .trim() ===

          this.selectedCategory
            .toLowerCase()
            .trim()

        );

    }


    // ==========================================
    // SEARCH FILTER
    // ==========================================

    if (
      this.searchText.trim().length > 0
    ) {

      const search =
        this.searchText
          .toLowerCase()
          .trim();


      result =
        result.filter(product =>

          product.name
            .toLowerCase()
            .includes(search)

          ||

          product.category
            ?.toLowerCase()
            .includes(search)

        );

    }


    // ==========================================
    // MINIMUM PRICE
    // ==========================================

    if (
      this.minPrice !== null &&
      this.minPrice !== undefined &&
      this.minPrice >= 0
    ) {

      result =
        result.filter(product =>

          Number(product.price) >=
          Number(this.minPrice)

        );

    }


    // ==========================================
    // MAXIMUM PRICE
    // ==========================================

    if (
      this.maxPrice !== null &&
      this.maxPrice !== undefined &&
      this.maxPrice >= 0
    ) {

      result =
        result.filter(product =>

          Number(product.price) <=
          Number(this.maxPrice)

        );

    }


    // ==========================================
    // PRICE SORT
    // ==========================================

    if (
      this.sortPrice === 'lowToHigh'
    ) {

      result.sort(

        (a, b) =>
          Number(a.price) -
          Number(b.price)

      );

    }


    if (
      this.sortPrice === 'highToLow'
    ) {

      result.sort(

        (a, b) =>
          Number(b.price) -
          Number(a.price)

      );

    }


    // ==========================================
    // FINAL RESULT
    // ==========================================

    this.filteredProducts =
      result;

  }


  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  selectCategory(
    category: string
  ): void {

    this.selectedCategory =
      category;

    this.filterProducts();

  }


  // ==========================================
  // SEARCH
  // ==========================================

  searchProducts(): void {

    this.filterProducts();

  }


  // ==========================================
  // PRICE FILTER CHANGE
  // ==========================================

  filterByPrice(): void {

    this.filterProducts();

  }


  // ==========================================
  // PRICE SORT CHANGE
  // ==========================================

  sortByPrice(): void {

    this.filterProducts();

  }


  // ==========================================
  // CLEAR ALL FILTERS
  // ==========================================

  clearFilters(): void {

    this.searchText = '';

    this.selectedCategory = 'All';

    this.minPrice = null;

    this.maxPrice = null;

    this.sortPrice = 'default';

    this.filterProducts();

  }


  // ==========================================
  // ADD TO CART
  // ==========================================

  addToCart(
    product: Product
  ): void {

    const currentUser =
      localStorage.getItem(
        'currentUser'
      );

    const adminLoggedIn =
      sessionStorage.getItem(
        'adminLoggedIn'
      );


    // ==========================================
    // LOGIN CHECK
    // ==========================================

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
            returnUrl:
              this.router.url
          }
        }
      );


      return;

    }


    // ==========================================
    // STOCK CHECK
    // ==========================================

    if (
      Number(product.stock) <= 0
    ) {

      alert(
        `${product.name} is out of stock.`
      );

      return;

    }


    // ==========================================
    // ADD TO CART
    // ==========================================

    this.cartService
      .addToCart(product);


    alert(
      product.name +
      ' Added To Cart'
    );

  }


  // ==========================================
  // ADD TO WISHLIST
  // ==========================================

  addToWishlist(
    product: Product
  ): void {

    const currentUser =
      localStorage.getItem(
        'currentUser'
      );

    const adminLoggedIn =
      sessionStorage.getItem(
        'adminLoggedIn'
      );


    // ==========================================
    // LOGIN CHECK
    // ==========================================

    if (
      !currentUser &&
      adminLoggedIn !== 'true'
    ) {

      alert(
        'Please login first to add products to wishlist.'
      );


      this.router.navigate(
        ['/login'],
        {
          queryParams: {
            returnUrl:
              this.router.url
          }
        }
      );


      return;

    }


    // ==========================================
    // ADD TO WISHLIST
    // ==========================================

    this.wishlistService
      .add(product);


    alert(
      product.name +
      ' Added To Wishlist'
    );

  }

}