import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { environment } from '../../environments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../responses/user/user.response';
import { UpdateUserDTO } from '../dtos/user/update.user.dto';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiBaseUrl = environment.apiBaseUrl;
  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0IjoiMTEyMjMzNDQiLCJ1c2VySWQiOjMsInN1YiI6IjExMjIzMzQ0IiwiZXhwIjoxNzM0Mjc3MzMzfQ.QQffqT-JIIESyAJsu-7ZOf5hxx6aAZeH6e5Qfr8XlKM';
  private http = inject(HttpClient);
  private httpUtilService = inject(HttpUtilService);
  localStorage?: Storage;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.localStorage = document.defaultView?.localStorage;
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  register(registerDTO: RegisterDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/users/register`, registerDTO, { headers: this.getAuthHeaders() });
  }

  login(loginDTO: LoginDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/users/login`, loginDTO, { headers: this.getAuthHeaders() });
  }

  getUserDetail(token: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/users/details`, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  updateUserDetail(token: string, updateUserDTO: UpdateUserDTO): Observable<ApiResponse> {
    const userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/users/details/${userResponse?.id}`, updateUserDTO, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    });
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      if (userResponse == null) {
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse);
      this.localStorage?.setItem('user', userResponseJSON);
      console.log('User response saved to local storage.');
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }

  getUserResponseFromLocalStorage(): UserResponse | null {
    try {
      const userResponseJSON = this.localStorage?.getItem('user');
      if (userResponseJSON == null) {
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON);
      console.log('User response retrieved from local storage.');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage:', error);
      return null;
    }
  }

  removeUserFromLocalStorage(): void {
    try {
      this.localStorage?.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
    }
  }

  getUsers(params: { page: number, limit: number, keyword: string }): Observable<ApiResponse> {
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString())
      .set('keyword', params.keyword);
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/users`, { params: httpParams, headers: this.getAuthHeaders() });
  }

  resetPassword(userId: number): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/users/reset-password/${userId}`, null, { headers: this.getAuthHeaders() });
  }

  toggleUserStatus(params: { userId: number, enable: boolean }): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/users/block/${params.userId}/${params.enable ? '1' : '0'}`, null, { headers: this.getAuthHeaders() });
  }
}
