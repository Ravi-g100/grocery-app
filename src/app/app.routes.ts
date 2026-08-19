import { Routes } from '@angular/router';


// ==========================================
// USER COMPONENTS
// ==========================================

import { Login } from './pages/login/login';

import { Dashboard } from './pages/dashboard/dashboard';

import { Register } from './pages/register/register';

import { Products } from './pages/products/products';

import { Home } from './pages/home/home';

import { ProductDetails } from './pages/product-details/product-details';

import { Categories } from './pages/categories/categories';

import { CheckoutComponent } from './pages/checkout/checkout';

import { CartComponent } from './pages/cart/cart';

import { OrderSuccessComponent } from './pages/order-success/order-success';

import { WishlistComponent } from './pages/wishlist/wishlist';

import { OrderHistoryComponent } from './pages/order-history/order-history';

import { OrderDetailsComponent } from './pages/order-details/order-details';

import { ProfileComponent } from './pages/profile/profile';


// ==========================================
// ADMIN COMPONENTS
// ==========================================

import { AdminOrdersComponent } from './pages/admin-orders/admin-orders';

import { AdminLoginComponent } from './pages/admin-login/admin-login';

import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';

import { AdminProductsComponent } from './pages/admin-products/admin-products';

import { AdminCategoriesComponent } from './pages/admin-categories/admin-categories';

import { AdminUsersComponent } from './pages/admin-users/admin-users';
import { AdminStaffComponent } from './pages/admin-staff/admin-staff';

// ==========================================
// STORE ASSISTANT
// ==========================================

import {
  StoreAssistantLoginComponent
} from './pages/store-assistant-login/store-assistant-login';


// ==========================================
// OTHER
// ==========================================

import { AboutUs } from './pages/about-us/about-us';


// ==========================================
// GUARDS
// ==========================================

import { authGuard } from './guards/auth-guard';

import { adminGuard } from './guards/admin-guard';


// ==========================================
// ROUTES
// ==========================================

export const routes: Routes = [


  // ==========================================
  // DEFAULT
  // ==========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // ==========================================
  // PUBLIC ROUTES
  // ==========================================

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'home',
    component: Home
  },


  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  {
    path: 'admin-login',
    component: AdminLoginComponent
  },


  // ==========================================
  // STORE ASSISTANT LOGIN
  // ==========================================

  {
    path: 'store-assistant-login',
    component: StoreAssistantLoginComponent
  },


  // ==========================================
  // USER ROUTES
  // ==========================================

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },

  {
    path: 'products',
    component: Products,
    canActivate: [authGuard]
  },

  {
    path: 'product/:id',
    component: ProductDetails,
    canActivate: [authGuard]
  },

  {
    path: 'categories',
    component: Categories,
    canActivate: [authGuard]
  },

  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard]
  },

  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [authGuard]
  },

  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard]
  },

  {
    path: 'order-success',
    component: OrderSuccessComponent,
    canActivate: [authGuard]
  },

  {
    path: 'orders',
    component: OrderHistoryComponent,
    canActivate: [authGuard]
  },

  {
    path: 'order-details/:id',
    component: OrderDetailsComponent,
    canActivate: [authGuard]
  },


  // ==========================================
  // ADMIN / STORE ASSISTANT ROUTES
  // ==========================================

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'admin-orders',
    component: AdminOrdersComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'admin-products',
    component: AdminProductsComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'admin-categories',
    component: AdminCategoriesComponent,
    canActivate: [adminGuard]
  },

  {
    path: 'admin-users',
    component: AdminUsersComponent,
    canActivate: [adminGuard]
  },


  // ==========================================
  // ABOUT US
  // ==========================================

  {
    path: 'about-us',
    component: AboutUs
  },
{
  path: 'admin-staff',
  component: AdminStaffComponent,
  canActivate: [adminGuard]
},

  // ==========================================
  // WRONG URL
  // ==========================================

  {
    path: '**',
    redirectTo: 'login'
  }

];