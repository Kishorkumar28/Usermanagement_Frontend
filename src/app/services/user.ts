import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  mobile?: string;
  department?: string;
  address?: string;
  status?: string;
  createdAt?: Date;
}



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = '/api/users'; // proxy.conf.json will forward to backend

  constructor(private http: HttpClient) {}

  // ✅ Get paginated + searched users
  getAll(page: number, limit: number, search: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}&search=${search}`);
  }

  // ✅ Get single user by ID
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // ✅ Create new user
  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // ✅ Update user
  update(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // ✅ Delete user
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
