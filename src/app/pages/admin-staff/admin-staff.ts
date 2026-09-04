import { Component } from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  RouterLink
} from '@angular/router';

import {
  StaffPermissions,
  StaffRequest,
  StaffService
} from '../../services/staff';


@Component({

  selector: 'app-admin-staff',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './admin-staff.html',

  styleUrl: './admin-staff.css'

})
export class AdminStaffComponent {


  requests: StaffRequest[] = [];

  loading = false;


  constructor(
    private staffService: StaffService
  ) {

    this.loadRequests();

  }


  // ==================================================
  // LOAD REQUESTS
  // ==================================================

  loadRequests(): void {

    this.loading = true;

    this.staffService
      .getRequests()
      .subscribe({

        next: (requests) => {

          this.requests = requests;

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Staff requests error:',
            error
          );

          this.loading = false;

          alert(
            'Store Assistant requests load nahi ho rahi hain.'
          );

        }

      });

  }


  // ==================================================
  // APPROVE
  // ==================================================

  approve(
    request: StaffRequest
  ): void {


    const permissions: StaffPermissions = {

      dashboard:
        request.permissions?.dashboard === true,

      orders:
        request.permissions?.orders === true,

      products:
        request.permissions?.products === true,

      categories:
        request.permissions?.categories === true,

      users:
        request.permissions?.users === true

    };


    this.staffService
      .approveRequest(
        request.id,
        permissions
      )
      .subscribe({

        next: () => {

          alert(
            'Store Assistant approved successfully.'
          );

          this.loadRequests();

        },

        error: (error) => {

          console.error(
            'Approval error:',
            error
          );

          alert(
            'Approval failed.'
          );

        }

      });

  }


  // ==================================================
  // REJECT
  // ==================================================

  reject(
    request: StaffRequest
  ): void {


    const confirmed =
      confirm(
        `Reject Store Assistant request from ${request.fullname}?`
      );


    if (!confirmed) {

      return;

    }


    this.staffService
      .rejectRequest(
        request.id
      )
      .subscribe({

        next: () => {

          alert(
            'Request rejected.'
          );

          this.loadRequests();

        },

        error: (error) => {

          console.error(
            'Reject error:',
            error
          );

          alert(
            'Reject failed.'
          );

        }

      });

  }


  // ==================================================
  // UPDATE PERMISSION
  // ==================================================

  updatePermission(
    request: StaffRequest
  ): void {


    const permissions: StaffPermissions = {

      dashboard:
        request.permissions?.dashboard === true,

      orders:
        request.permissions?.orders === true,

      products:
        request.permissions?.products === true,

      categories:
        request.permissions?.categories === true,

      users:
        request.permissions?.users === true

    };


    this.staffService
      .updatePermissions(

        request.id,

        permissions

      )
      .subscribe({

        next: () => {

          alert(
            'Permissions updated successfully.'
          );

          this.loadRequests();

        },

        error: (error) => {

          console.error(
            'Permission update error:',
            error
          );

          alert(
            'Permission update failed.'
          );

        }

      });

  }

}