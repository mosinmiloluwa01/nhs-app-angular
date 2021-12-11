import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserModel } from '../components/models/data';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiBaseUrl = environment.baseUrl

  constructor(
    private http: HttpClient
  ) { }

  getAllUsers() {
    return this.http.get<any>(`${this.apiBaseUrl}users`);
  }
  editUser(data: UserModel) {
    return this.http.put<any>(`${this.apiBaseUrl}users/${data.id}`, data);
  }
  getAllGenders() {
    return this.http.get<any>(`${this.apiBaseUrl}gender`);
  }
  getAllSymptoms() {
    return this.http.get<any>(`${this.apiBaseUrl}symptoms`);
  }
}
