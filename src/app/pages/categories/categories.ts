import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-categories',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './categories.html',

  styleUrl: './categories.css'
})
export class Categories {

  categories: string[] = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {

    this.loadCategories();

  }

  // =========================
  // LOAD CATEGORIES
  // =========================

  loadCategories(): void {

    this.categories =
      this.categoryService.getCategories();

  }

  // =========================
  // CATEGORY IMAGE
  // =========================

  getCategoryImage(
    category: string
  ): string {

    const images: {
      [key: string]: string
    } = {

      'Atta':
        'assets/images/atta.png',

      'Rice':
        'assets/images/rice.png',

      'Dal':
        'assets/images/dal.png',

      'Oil':
        'assets/images/oil.png',

      'Tea':
        'assets/images/tea.png',

      'Coffee':
        'assets/images/coffee.png',

      'Salt':
        'assets/images/salt.png',

      'Sugar':
        'assets/images/sugar.png',

      'Spices':
        'assets/images/spices.png',

      'Biscuits':
        'assets/images/biscuits.png',

      'Snacks':
        'assets/images/snacks.png'

    };

    return images[category]
      || 'assets/images/grocery.png';

  }

  // =========================
  // OPEN CATEGORY PRODUCTS
  // =========================

  openCategory(
    category: string
  ): void {

    this.router.navigate(
      ['/products'],
      {
        queryParams: {
          category: category
        }
      }
    );

  }

}