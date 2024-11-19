import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../responses/order/order.response';
import { environment } from '../../../environments/environment';
import { OrderDetail } from '../../models/order.detail';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';
import { OrderService } from '../../services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule
  ]
})
export class OrderManagementComponent extends BaseComponent implements OnInit {
  orders: OrderResponse[] = [];  // Mảng chứa tất cả các đơn hàng
  loading: boolean = true;  // Biến trạng thái loading để hiển thị khi dữ liệu đang được tải
  error: string = '';  // Biến lưu thông báo lỗi nếu có

  ngOnInit(): void {
    this.getOrders();  // Gọi hàm để lấy danh sách đơn hàng khi component được khởi tạo
  }

  // Hàm chuyển đổi thời gian UTC sang múi giờ Việt Nam (GMT+7)
  convertToVietnamTime(date: Date): Date {
    const vietnamOffset = 7 ; // GMT+7 in minutes
    const localOffset = date.getTimezoneOffset(); // Local timezone offset in minutes
    const vietnamDate = new Date(date.getTime() + (vietnamOffset + localOffset) * 60000);
    return vietnamDate;
  }

  getOrders(): void {
    this.orderService.getOrdersByUserId(this.tokenService.getUserId()).subscribe({
      next: (apiResponse: ApiResponse) => {
        if (apiResponse.status === 'OK') {
          const response = apiResponse.data;
          console.log(response);
  
          // Sắp xếp đơn hàng theo id từ lớn nhất tới bé nhất (đơn mới nhất lên đầu)
          this.orders = response.map((order: any) => {
            order.order_date = this.convertToVietnamTime(new Date(order.order_date));
            order.order_details = order.order_details.map((detail: any) => {
              detail.thumbnail = `${environment.apiBaseUrl}/products/images/${detail.thumbnail}`;
              return detail;
            });
            return order;
          });
  
          // Sắp xếp theo ID từ lớn nhất tới bé nhất
          this.orders.sort((a, b) => b.id - a.id);
  
          if (this.orders.length === 0) {
            // Hiển thị popup nếu không có đơn hàng
            Swal.fire({
              icon: 'info',
              title: 'No Orders Found',
              text: 'You do not have any orders yet.',
              confirmButtonText: 'OK', // Nút "OK"
              allowOutsideClick: false // Không cho phép đóng popup bằng cách click bên ngoài
            }).then(() => {
              this.router.navigate(['/']); // Chuyển hướng về trang home sau khi nhấn "OK"
            });
          }
  
          this.loading = false; // Đặt trạng thái loading là false sau khi dữ liệu được tải xong
        } else {
          this.error = 'Không thể lấy danh sách đơn hàng.';
          this.loading = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.error = 'Đã xảy ra lỗi trong quá trình lấy dữ liệu.';
        this.loading = false;
      }
    });
  }
}
