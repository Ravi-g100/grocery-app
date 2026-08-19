import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-admin-products',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './admin-products.html',

  styleUrl: './admin-products.css'
})
export class AdminProductsComponent {

  // =========================================
  // PRODUCTS
  // =========================================

  products: Product[] = [];

  filteredProducts: Product[] = [];


  // =========================================
  // CATEGORIES
  // =========================================

  categories: string[] = [];

  selectedCategory = 'All';


  // =========================================
  // SEARCH
  // =========================================

  searchText = '';


  // =========================================
  // STOCK FILTER
  // =========================================

  stockFilter = 'All';


  // =========================================
  // PRODUCT FORM
  // =========================================

  product: Product = {

    id: 0,

    name: '',

    category: '',

    price: 0,

    image: '',

    stock: 0

  };


  // =========================================
  // EDIT MODE
  // =========================================

  editing = false;


  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(

    private productService: ProductService,

    private categoryService: CategoryService

  ) {

    this.loadProducts();

    this.loadCategories();

  }


  // =========================================
  // LOAD PRODUCTS
  // =========================================

  loadProducts(): void {

    this.productService
      .getProducts()
      .subscribe({

        next: (products: Product[]) => {

          this.products = products || [];

          this.filterProducts();

        },

        error: (error) => {

          console.error(
            'Products load error:',
            error
          );

          this.products = [];

          this.filteredProducts = [];

          alert(
            'Products load nahi ho rahe hain.'
          );

        }

      });

  }


  // =========================================
  // LOAD CATEGORIES
  // =========================================

  loadCategories(): void {

    this.categories =
      this.categoryService.getCategories();

  }


  // =========================================
  // FILTER PRODUCTS
  // =========================================

  filterProducts(): void {

    let result =
      [...this.products];


    // =======================================
    // CATEGORY FILTER
    // =======================================

    if (
      this.selectedCategory !== 'All'
    ) {

      result =
        result.filter(

          product =>

            product.category
              ?.toLowerCase()
              .trim() ===

            this.selectedCategory
              .toLowerCase()
              .trim()

        );

    }


    // =======================================
    // SEARCH FILTER
    // =======================================

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    if (search.length > 0) {

      result =
        result.filter(

          product =>

            product.name
              ?.toLowerCase()
              .includes(search)

            ||

            product.category
              ?.toLowerCase()
              .includes(search)

        );

    }


    // =======================================
    // STOCK FILTER
    // =======================================

    if (
      this.stockFilter === 'Low'
    ) {

      result =
        result.filter(

          product =>

            Number(product.stock) > 0 &&

            Number(product.stock) <= 5

        );

    }


    if (
      this.stockFilter === 'Out'
    ) {

      result =
        result.filter(

          product =>

            Number(product.stock) === 0

        );

    }


    // =======================================
    // FINAL
    // =======================================

    this.filteredProducts =
      result;

  }


  // =========================================
  // CATEGORY CHANGE
  // =========================================

  selectCategory(
    category: string
  ): void {

    this.selectedCategory =
      category;

    this.filterProducts();

  }


  // =========================================
  // SEARCH
  // =========================================

  searchProducts(): void {

    this.filterProducts();

  }


  // =========================================
  // STOCK FILTER
  // =========================================

  selectStockFilter(
    filter: string
  ): void {

    this.stockFilter =
      filter;

    this.filterProducts();

  }


  // =========================================
  // SAVE PRODUCT
  // ADD / UPDATE
  // =========================================

  saveProduct(): void {

    // =======================================
    // NAME
    // =======================================

    if (
      !this.product.name ||
      !this.product.name.trim()
    ) {

      alert(
        'Please enter product name.'
      );

      return;

    }


    // =======================================
    // CATEGORY
    // =======================================

    if (
      !this.product.category ||
      !this.product.category.trim()
    ) {

      alert(
        'Please select product category.'
      );

      return;

    }


    // =======================================
    // PRICE
    // =======================================

    if (
      Number(this.product.price) <= 0
    ) {

      alert(
        'Product price must be greater than 0.'
      );

      return;

    }


    // =======================================
    // STOCK
    // =======================================

    if (
      Number(this.product.stock) < 0
    ) {

      alert(
        'Stock cannot be negative.'
      );

      return;

    }


    // =======================================
    // UPDATE PRODUCT
    // =======================================

    if (this.editing) {

      const updatedProduct: Product = {

        ...this.product,

        id: Number(this.product.id),

        price: Number(this.product.price),

        stock: Number(this.product.stock)

      };


      this.productService
        .updateProduct(updatedProduct)
        .subscribe({

          next: () => {

            alert(
              'Product Updated Successfully.'
            );

            this.loadProducts();

            this.resetForm();

          },

          error: (error) => {

            console.error(
              'Product update error:',
              error
            );

            alert(
              error?.error?.message ||
              'Product update failed.'
            );

          }

        });

      return;

    }


    // =======================================
    // ADD PRODUCT
    // =======================================

    const newProduct: Product = {

      ...this.product,

      id: 0,

      price: Number(this.product.price),

      stock: Number(this.product.stock)

    };


    this.productService
      .addProduct(newProduct)
      .subscribe({

        next: () => {

          alert(
            'Product Added Successfully.'
          );

          this.loadProducts();

          this.resetForm();

        },

        error: (error) => {

          console.error(
            'Product add error:',
            error
          );

          alert(
            error?.error?.message ||
            'Product add failed.'
          );

        }

      });

  }


  // =========================================
  // EDIT PRODUCT
  // =========================================

  editProduct(
    product: Product
  ): void {

    this.product = {

      ...product,

      id: Number(product.id),

      price: Number(product.price),

      stock: Number(product.stock)

    };


    this.editing = true;


    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }


  // =========================================
  // DELETE PRODUCT
  // =========================================

  deleteProduct(
    id: number
  ): void {

    if (!id) {

      alert(
        'Invalid product ID.'
      );

      return;

    }


    const confirmed =
      confirm(
        'Are you sure you want to delete this product?'
      );


    if (!confirmed) {

      return;

    }


    this.productService
      .deleteProduct(Number(id))
      .subscribe({

        next: () => {

          alert(
            'Product Deleted Successfully.'
          );

          // Agar wahi product edit ho raha tha
          if (
            this.product.id === id
          ) {

            this.resetForm();

          }

          this.loadProducts();

        },

        error: (error) => {

          console.error(
            'Product delete error:',
            error
          );

          alert(
            error?.error?.message ||
            'Product delete failed.'
          );

        }

      });

  }


  // =========================================
  // RESET FORM
  // =========================================

  resetForm(): void {

    this.product = {

      id: 0,

      name: '',

      category: '',

      price: 0,

      image: '',

      stock: 0

    };


    this.editing = false;

  }


  // =========================================
  // CANCEL EDIT
  // =========================================

  cancelEdit(): void {

    this.resetForm();

  }


  // =========================================
  // STOCK STATUS
  // =========================================

  getStockStatus(
    stock: number
  ): string {

    const value =
      Number(stock);


    if (value === 0) {

      return 'Out of Stock';

    }


    if (value <= 5) {

      return 'Low Stock';

    }


    return 'In Stock';

  }


  // =========================================
  // STOCK CLASS
  // =========================================

  getStockClass(
    stock: number
  ): string {

    const value =
      Number(stock);


    if (value === 0) {

      return 'text-danger';

    }


    if (value <= 5) {

      return 'text-warning';

    }


    return 'text-success';

  }

}