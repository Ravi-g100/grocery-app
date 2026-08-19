import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-navigation',
  standalone: true,
  templateUrl: './page-navigations.html',
  styleUrl: './page-navigations.css'
})
export class PageNavigation {

  constructor(
    private location: Location,
    private router: Router
  ) {}

  goBack(): void {
    this.location.back();
  }

  goDashboard(): void {
    const user = localStorage.getItem('user');

    if (user) {
      try {
        const userData = JSON.parse(user);

        if (userData.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
          return;
        }
      } catch {
        // Invalid user data
      }
    }

    this.router.navigate(['/dashboard']);
  }

  isAdmin(): boolean {
    const user = localStorage.getItem('user');

    if (!user) {
      return false;
    }

    try {
      const userData = JSON.parse(user);
      return userData.role === 'admin';
    } catch {
      return false;
    }
  }
}