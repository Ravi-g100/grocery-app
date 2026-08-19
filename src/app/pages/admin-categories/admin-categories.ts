import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CategoryService } from '../../services/category';

@Component({
  selector: 'app-admin-categories',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './admin-categories.html',

  styleUrl: './admin-categories.css'
})
export class AdminCategoriesComponent {

  categories: string[] = [];

  categoryName = '';

  editingIndex = -1;


  constructor(
    private categoryService: CategoryService
  ) {

    this.loadCategories();

  }


  // =========================
  // LOAD CATEGORIES
  // =========================

  loadCategories() {

    this.categories =
      this.categoryService.getCategories();

  }


  // =========================
  // ADD CATEGORY
  // =========================

  addCategory() {

    const name =
      this.categoryName.trim();


    if (!name) {

      alert(
        'Please enter category name'
      );

      return;

    }


    const exists =
      this.categories.some(
        category =>
          category.toLowerCase() ===
          name.toLowerCase()
      );


    if (exists) {

      alert(
        'Category already exists'
      );

      return;

    }


    this.categoryService
      .addCategory(name);


    this.loadCategories();


    this.categoryName = '';


    alert(
      'Category Added Successfully'
    );

  }


  // =========================
  // EDIT CATEGORY
  // =========================

  editCategory(
    index: number
  ) {

    this.categoryName =
      this.categories[index];

    this.editingIndex = index;

  }


  // =========================
  // UPDATE CATEGORY
  // =========================

  updateCategory() {

    const name =
      this.categoryName.trim();


    if (!name) {

      alert(
        'Please enter category name'
      );

      return;

    }


    const duplicate =
      this.categories.some(
        (category, index) =>

          index !== this.editingIndex &&

          category.toLowerCase() ===
          name.toLowerCase()
      );


    if (duplicate) {

      alert(
        'Category already exists'
      );

      return;

    }


    this.categoryService
      .updateCategory(
        this.editingIndex,
        name
      );


    this.loadCategories();


    this.resetForm();


    alert(
      'Category Updated Successfully'
    );

  }


  // =========================
  // DELETE CATEGORY
  // =========================

  deleteCategory(
    index: number
  ) {

    const confirmDelete =
      confirm(
        'Are you sure you want to delete this category?'
      );


    if (!confirmDelete) {

      return;

    }


    this.categoryService
      .deleteCategory(index);


    this.loadCategories();


    alert(
      'Category Deleted Successfully'
    );

  }


  // =========================
  // SAVE CATEGORY
  // =========================

  saveCategory() {

    if (
      this.editingIndex === -1
    ) {

      this.addCategory();

    }
    else {

      this.updateCategory();

    }

  }


  // =========================
  // RESET FORM
  // =========================

  resetForm() {

    this.categoryName = '';

    this.editingIndex = -1;

  }

}