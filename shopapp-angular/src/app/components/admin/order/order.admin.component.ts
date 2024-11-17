import { Component, OnInit, Inject } from '@angular/core';
import { OrderResponse } from '../../../responses/order/order.response';
import { CommonModule,DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../responses/api.response';
import {  HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../../base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})
export class OrderAdminComponent extends BaseComponent implements OnInit{  
  orders: OrderResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  keyword:string = "";
  visiblePages: number[] = [];
  localStorage?:Storage;

  constructor() {
    super();
    this.localStorage = document.defaultView?.localStorage;
  }
  
  ngOnInit(): void {
    debugger
    this.currentPage = Number(this.localStorage?.getItem('currentOrderAdminPage')) || 0; 
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }
  searchOrders() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    //Mediocre Iron Wallet
    debugger
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }

  getAllOrders(keyword: string, page: number, limit: number) {
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        if (apiResponse && apiResponse.data) {
          console.log('API response data:', apiResponse.data);
          this.orders = apiResponse.data; // Gán dữ liệu vào `orders`
          this.totalPages = apiResponse.data.totalPages; // Gán số trang nếu có
        } else {
          console.error('Unexpected API response structure:', apiResponse);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching orders:', error.message);
      }
    });
  }
  
  onPageChange(page: number) {
    debugger;
    this.currentPage = page < 0 ? 0 : page;
    this.localStorage?.setItem('currentOrderAdminPage', String(this.currentPage));         
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }
  

  deleteOrder(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.deleteOrder(id).subscribe({
          next: (response: ApiResponse) => {
            Swal.fire('Deleted!', 'The order has been deleted successfully.', 'success');
            this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage); // Cập nhật lại danh sách
          },
          error: (error: HttpErrorResponse) => {
            console.error(error?.error?.message ?? '');
            Swal.fire('Error', 'Failed to delete the order.', 'error');
          }
        });
      }
    });
  }
  
  viewDetails(order:OrderResponse) {
    debugger
    this.router.navigate(['/admin/orders', order.id]);
  }
  
}