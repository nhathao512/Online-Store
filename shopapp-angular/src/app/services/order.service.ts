import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderDTO } from '../dtos/order/order.dto';
import { ApiResponse } from '../responses/api.response';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiBaseUrl}/orders`;
  private apiGetAllOrders = `${environment.apiBaseUrl}/orders/get-orders-by-keyword`;
  private token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWJqZWN0IjoiMTEyMjMzNDQiLCJ1c2VySWQiOjMsInN1YiI6IjExMjIzMzQ0IiwiZXhwIjoxNzM0Mjc3MzMzfQ.QQffqT-JIIESyAJsu-7ZOf5hxx6aAZeH6e5Qfr8XlKM';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  placeOrder(orderData: OrderDTO): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, orderData, { headers: this.getAuthHeaders() });
  }

  getOrderById(orderId: number): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.get<ApiResponse>(url, { headers: this.getAuthHeaders() });
  }

  getOrdersByUserId(userId: number): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/orders/user/${userId}`;  // Endpoint API
    return this.http.get<ApiResponse>(url, { headers: this.getAuthHeaders() });
  }

  getAllOrders(keyword: string, page: number, limit: number): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ApiResponse>(this.apiGetAllOrders, { params, headers: this.getAuthHeaders() });
  }

  updateOrder(orderId: number, orderData: OrderDTO): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.put<ApiResponse>(url, orderData, { headers: this.getAuthHeaders() });
  }

  deleteOrder(orderId: number): Observable<ApiResponse> {
    const url = `${environment.apiBaseUrl}/orders/${orderId}`;
    return this.http.delete<ApiResponse>(url, { headers: this.getAuthHeaders() });
  }
}
