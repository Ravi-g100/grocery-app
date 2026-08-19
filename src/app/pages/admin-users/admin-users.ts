import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  User,
  UserService
} from '../../services/user';


@Component({
  selector: 'app-admin-users',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './admin-users.html',

  styleUrl: './admin-users.css'
})
export class AdminUsersComponent {

  users: User[] = [];

  searchText = '';

  loading = false;


  constructor(
    private userService: UserService
  ) {

    this.loadUsers();

  }


  // ==========================================
  // LOAD USERS
  // ==========================================

  loadUsers(): void {

    this.loading = true;

    this.userService
      .getUsers()
      .subscribe({

        next: (users) => {

          this.users = users;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Get users error:',
            error
          );

          this.users = [];

          this.loading = false;

          alert(
            'Users load nahi ho pa rahe hain.'
          );

        }

      });

  }


  // ==========================================
  // SEARCH USERS
  // ==========================================

  get filteredUsers(): User[] {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    if (!search) {

      return this.users;

    }


    return this.users.filter(

      user =>

        user.fullname
          .toLowerCase()
          .includes(search)

        ||

        user.email
          .toLowerCase()
          .includes(search)

        ||

        user.mobile
          .includes(search)

    );

  }


  // ==========================================
  // BLOCK / UNBLOCK USER
  // ==========================================

  toggleBlock(user: User): void {

    // Admin ko block nahi karna
    if (user.role === 'admin') {

      alert(
        'Admin user ko block nahi kiya ja sakta.'
      );

      return;

    }


    const action =
      user.blocked
        ? 'unblock'
        : 'block';


    const confirmAction =
      confirm(

        user.blocked

          ? `Are you sure you want to unblock ${user.fullname}?`

          : `Are you sure you want to block ${user.fullname}?`

      );


    if (!confirmAction) {

      return;

    }


    this.userService
      .toggleBlock(user.id)
      .subscribe({

        next: () => {

          // List refresh
          this.loadUsers();


          if (user.blocked) {

            alert(
              `${user.fullname} has been unblocked successfully.`
            );

          }

          else {

            alert(
              `${user.fullname} has been blocked successfully.`
            );

          }

        },


        error: (error) => {

          console.error(
            'Block/unblock error:',
            error
          );

          alert(
            `Unable to ${action} user.`
          );

        }

      });

  }


  // ==========================================
  // DELETE USER
  // ==========================================

  deleteUser(user: User): void {

    const confirmDelete =
      confirm(

        `Are you sure you want to delete ${user.fullname}?`

      );


    if (!confirmDelete) {

      return;

    }


    this.userService
      .deleteUser(user.id)
      .subscribe({

        next: () => {

          alert(
            'User Deleted Successfully'
          );

          this.loadUsers();

        },


        error: (error) => {

          console.error(
            'Delete user error:',
            error
          );

          alert(
            'Unable to delete user.'
          );

        }

      });

  }


  // ==========================================
  // TOTAL USERS
  // ==========================================

  get totalUsers(): number {

    return this.users.length;

  }


  // ==========================================
  // ACTIVE USERS
  // ==========================================

  get activeUsers(): number {

    return this.users.filter(
      user => !user.blocked
    ).length;

  }


  // ==========================================
  // BLOCKED USERS
  // ==========================================

  get blockedUsers(): number {

    return this.users.filter(
      user => user.blocked
    ).length;

  }


  // ==========================================
  // NORMAL USERS
  // ==========================================

  get normalUsers(): number {

    return this.users.filter(
      user => user.role === 'user'
    ).length;

  }


  // ==========================================
  // ADMIN USERS
  // ==========================================

  get adminUsers(): number {

    return this.users.filter(
      user => user.role === 'admin'
    ).length;

  }

}