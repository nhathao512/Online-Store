import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';
import { UpdateCategoryDTO } from '../dtos/category/update.category.dto';
import { InsertCategoryDTO } from '../dtos/category/insert.category.dto';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }
  getCategories(page: number, limit: number):Observable<ApiResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());           
      return this.http.get<ApiResponse>(`${environment.apiBaseUrl}/categories`, { params });           
  }
  getDetailCategory(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/categories/${id}`);
  }
  deleteCategory(id: number): Observable<ApiResponse> {
    debugger
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0IjoiMTEyMjMzNDQiLCJ1c2VySWQiOjMsInN1YiI6IjExMjIzMzQ0IiwiZXhwIjoxNzM0Mjc3MzMzfQ.QQffqT-JIIESyAJsu-7ZOf5hxx6aAZeH6e5Qfr8XlKM';
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`,
    })
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/categories/${id}`, {headers});
  }
  updateCategory(id: number, updatedCategory: UpdateCategoryDTO): Observable<ApiResponse> {
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0IjoiMTEyMjMzNDQiLCJ1c2VySWQiOjMsInN1YiI6IjExMjIzMzQ0IiwiZXhwIjoxNzM0Mjc3MzMzfQ.QQffqT-JIIESyAJsu-7ZOf5hxx6aAZeH6e5Qfr8XlKM';
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`,
    })
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/categories/${id}`, updatedCategory, {headers});
  }  
  insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<ApiResponse> {
    // Add a new category
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0IjoiMTEyMjMzNDQiLCJ1c2VySWQiOjMsInN1YiI6IjExMjIzMzQ0IiwiZXhwIjoxNzM0Mjc3MzMzfQ.QQffqT-JIIESyAJsu-7ZOf5hxx6aAZeH6e5Qfr8XlKM';
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`,
    })
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/categories`, insertCategoryDTO, {headers});
  }
}
