import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


export interface StaffPermissions {

  dashboard: boolean;

  orders: boolean;

  products: boolean;

  categories: boolean;

  users: boolean;

}


export interface StaffRequest {

  id: number;

  fullname: string;

  mobile: string;

  email: string;

  address: string;

  city: string;

  pincode: string;

  status:
    | 'pending'
    | 'approved'
    | 'rejected';

  permissions: StaffPermissions;

  created_at: string;

  approved_at?: string;

}


@Injectable({
  providedIn: 'root'
})
export class StaffService {


  private apiUrl =
    'http://localhost:3000/api/staff';


  constructor(
    private http: HttpClient
  ) {}


  // ==================================================
  // CREATE REQUEST
  // ==================================================

  createRequest(data: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/request`,
      data
    );

  }


  // ==================================================
  // GET REQUESTS
  // ==================================================

  getRequests(): Observable<StaffRequest[]> {

    return this.http.get<StaffRequest[]>(
      `${this.apiUrl}/requests`
    );

  }


  // ==================================================
  // APPROVE
  // ==================================================

  approveRequest(
    id: number,
    permissions: StaffPermissions
  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/requests/${id}/approve`,

      permissions

    );

  }


  // ==================================================
  // REJECT
  // ==================================================

  rejectRequest(
    id: number
  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/requests/${id}/reject`,

      {}

    );

  }


  // ==================================================
  // UPDATE PERMISSIONS
  // ==================================================

  updatePermissions(
    id: number,
    permissions: StaffPermissions
  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/requests/${id}/permissions`,

      permissions

    );

  }


  // ==================================================
  // LOGIN
  // ==================================================

  login(
    email: string,
    password: string
  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/login`,

      {
        email,
        password
      }

    );

  }

}