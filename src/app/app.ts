import { Component } from '@angular/core';

import {
  Router,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';

import { Navbar } from './components/navbar/navbar';

import {
  filter
} from 'rxjs';


@Component({

  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
    Navbar
  ],

  templateUrl: './app.html',

  styleUrl: './app.css'

})
export class AppComponent {

  showNavbar = true;


  constructor(
    private router: Router
  ) {

    // ==========================================
    // CHECK ROUTE
    // ==========================================

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(
        (event: NavigationEnd) => {

          const url =
            event.urlAfterRedirects;


          // =====================================
          // LOGIN / REGISTER PAGE
          // =====================================

          if (
            url === '/login' ||
            url === '/register'
          ) {

            this.showNavbar = false;

          }

          // =====================================
          // ADMIN PAGES
          // =====================================

          else if (
            url.startsWith('/admin-')
          ) {

            this.showNavbar = false;

          }

          // =====================================
          // OTHER PAGES
          // =====================================

          else {

            this.showNavbar = true;

          }

        }
      );

  }

}