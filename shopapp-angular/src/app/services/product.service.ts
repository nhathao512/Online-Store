import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';
import { UpdateProductDTO } from '../dtos/product/update.product.dto';
import { InsertProductDTO } from '../dtos/product/insert.product.dto';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiBaseUrl = environment.apiBaseUrl;
  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0IjoiMTEyMjMzNDQiLCJ1c2VySWQiOjMsInN1YiI6IjExMjIzMzQ0IiwiZXhwIjoxNzM0Mjc3MzMzfQ.QQffqT-JIIESyAJsu-7ZOf5hxx6aAZeH6e5Qfr8XlKM'; // Thay bằng token thật

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  getProducts(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number
  ): Observable<ApiResponse> {
    const params = {
      keyword: keyword,
      category_id: categoryId.toString(),
      page: page.toString(),
      limit: limit.toString()
    };
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/products`, { params, headers: this.getAuthHeaders() });
  }

  getDetailProduct(productId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`, { headers: this.getAuthHeaders() });
  }

  getProductsByIds(productIds: number[]): Observable<ApiResponse> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/products/by-ids`, { params, headers: this.getAuthHeaders() });
  }

  deleteProduct(productId: number): Observable<ApiResponse> {
    debugger;
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`, { headers: this.getAuthHeaders() });
  }

  updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/products/${productId}`, updatedProduct, { headers: this.getAuthHeaders() });
  }

  insertProduct(insertProductDTO: InsertProductDTO): Observable<ApiResponse> {
    // Add a new product
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/products`, insertProductDTO, { headers: this.getAuthHeaders() });
  }

  uploadImages(productId: number, files: File[]): Observable<ApiResponse> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // Upload images for the specified product id
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/products/uploads/${productId}`, formData, { headers: this.getAuthHeaders() });
  }

  deleteProductImage(id: number): Observable<any> {
    debugger;
    return this.http.delete<string>(`${this.apiBaseUrl}/product_images/${id}`, { headers: this.getAuthHeaders() });
  }
}
