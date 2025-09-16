import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getAll(page: number, limit: number, search: string, sortColumn?: string, sortDirection?: string): Observable<any> {
  let url = `${this.apiUrl}?page=${page}&limit=${limit}&search=${search}`;

  // append sorting params if provided
  if (sortColumn && sortDirection) {
    url += `&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;
  }

  return this.http.get<any>(url);
}


  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
