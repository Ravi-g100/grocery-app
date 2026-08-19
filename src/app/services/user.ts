import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface User {

  id: number;

  fullname: string;

  mobile: string;

  email: string;

  password: string;

  address: string;

  city: string;

  pincode: string;

  role: 'user' | 'admin' | 'store_assistant';

  blocked: boolean;

}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl =
    'http://localhost:3000/api/users';


  constructor(
    private http: HttpClient
  ) {}


  // ==========================================
  // REGISTER USER
  // ==========================================

  registerUser(
    user: Omit<User, 'id' | 'role' | 'blocked'>
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/register`,
      user
    );

  }


  // ==========================================
  // GET ALL USERS
  // ==========================================

  getUsers(): Observable<User[]> {

    return this.http.get<User[]>(
      this.apiUrl
    );

  }


  // ==========================================
  // GET USER BY EMAIL
  // ==========================================

  getUserByEmail(
    email: string
  ): Observable<User> {

    return this.http.get<User>(
      `${this.apiUrl}/email/${encodeURIComponent(email)}`
    );

  }


  // ==========================================
  // LOGIN USER
  // ==========================================

  loginUser(
    email: string,
    password: string
  ): Observable<User> {

    return this.http
      .post<{ user: User }>(
        `${this.apiUrl}/login`,
        {
          email,
          password
        }
      )
      .pipe(
        map(response => response.user)
      );

  }


  // ==========================================
  // UPDATE USER
  // ==========================================

  updateUser(
    user: User
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${user.id}`,
      user
    );

  }


  // ==========================================
  // UPDATE PASSWORD
  // ==========================================

  updatePassword(
    email: string,
    newPassword: string
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/password`,
      {
        email,
        password: newPassword
      }
    );

  }


  // ==========================================
  // DELETE USER
  // ==========================================

  deleteUser(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================
  // BLOCK / UNBLOCK USER
  // ==========================================

  toggleBlock(
    id: number
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}/toggle-block`,
      {}
    );

  }

}