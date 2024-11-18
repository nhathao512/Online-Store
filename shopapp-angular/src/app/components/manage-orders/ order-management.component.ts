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
import moment from 'moment-timezone';
 

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
  convertToVietnamTime(date: Date): string {
    return moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY, HH:mm');
  }

  getOrders(): void {
    this.orderService.getOrdersByUserId(this.tokenService.getUserId()).subscribe({
      next: (apiResponse: ApiResponse) => {
        if (apiResponse.status === 'OK') {
          const response = apiResponse.data;
          console.log(response);
          this.orders = response.map((order: any) => {
            order.order_date = this.convertToVietnamTime(new Date(order.order_date));
            order.order_details = order.order_details.map((detail: any) => {
              detail.thumbnail = `${environment.apiBaseUrl}/products/images/${detail.thumbnail}`;
              return detail;
            });
            return order;
          });
          this.loading = false;  // Đặt trạng thái loading là false sau khi dữ liệu được tải xong
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
