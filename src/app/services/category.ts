import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private storageKey =
    'groceryCategories';


  private categories: string[] = [

     'Atta',
    'Rice',
    'Dal',
    'Oil',
    'Sugar',
    'Salt',
    'Spices',
    'Tea',
    'Biscuits',
    'Packaged Food',
    'Dairy & Milk Products',
    'Bread & Bakery',
    'Fruits',
    'Vegetables',
    'Dry Fruits & Nuts',
    'Beverages',
    'Personal Care',
    'Household Cleaning',
    'Baby Care',
    'Pet Food',
    'Instant Food'

  ];


  constructor() {

    const savedCategories =
      localStorage.getItem(
        this.storageKey
      );


    if (savedCategories) {

      try {

        this.categories =
          JSON.parse(
            savedCategories
          );

      } catch {

        this.saveCategories();

      }

    }

    else {

      this.saveCategories();

    }

  }


  // ==========================================
  // GET CATEGORIES
  // ==========================================

  getCategories(): string[] {

    return [
      ...this.categories
    ];

  }


  // ==========================================
  // SAVE CATEGORIES
  // ==========================================

  private saveCategories(): void {

    localStorage.setItem(

      this.storageKey,

      JSON.stringify(
        this.categories
      )

    );

  }


  // ==========================================
  // ADD CATEGORY
  // ==========================================

  addCategory(
    name: string
  ): void {

    const category =
      name.trim();


    if (!category) {

      return;

    }


    const exists =
      this.categories.some(

        x =>
          x.toLowerCase() ===
          category.toLowerCase()

      );


    if (exists) {

      return;

    }


    this.categories.push(
      category
    );


    this.saveCategories();

  }


  // ==========================================
  // UPDATE CATEGORY
  // ==========================================

  updateCategory(
    index: number,
    name: string
  ): void {

    if (
      index < 0 ||
      index >= this.categories.length
    ) {

      return;

    }


    const category =
      name.trim();


    if (!category) {

      return;

    }


    this.categories[index] =
      category;


    this.saveCategories();

  }


  // ==========================================
  // DELETE CATEGORY
  // ==========================================

  deleteCategory(
    index: number
  ): void {

    if (
      index < 0 ||
      index >= this.categories.length
    ) {

      return;

    }


    this.categories.splice(
      index,
      1
    );


    this.saveCategories();

  }

}