  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { environment } from '../../../../environments/environment';
  import { OrderDTO } from '../../../dtos/order/order.dto';
  import { OrderResponse } from '../../../responses/order/order.response';
  import { ApiResponse } from '../../../responses/api.response';
  import { HttpErrorResponse } from '@angular/common/http';
  import { BaseComponent } from '../../base/base.component';
  import Swal from 'sweetalert2';
  @Component({
    selector: 'app-detail-order-admin',
    templateUrl: './detail.order.admin.component.html',
    styleUrls: ['./detail.order.admin.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
    ]
  })

  export class DetailOrderAdminComponent extends BaseComponent implements OnInit {
    orderId: number = 0;
    orderResponse: OrderResponse = {
      id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
      user_id: 0,
      fullname: '',
      phone_number: '',
      email: '',
      address: '',
      note: '',
      order_date: new Date(),
      status: '',
      total_money: 0,
      shipping_method: '',
      shipping_address: '',
      shipping_date: new Date(),
      payment_method: '',
      order_details: [],

    };

    ngOnInit(): void {
      this.getOrderDetails();
    }

    getOrderDetails(): void {
      // debugger
      this.orderId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (apiResponse: ApiResponse) => {
          // debugger;
          const response = apiResponse.data
          this.orderResponse.id = response.id;
          this.orderResponse.user_id = response.user_id;
          this.orderResponse.fullname = response.fullname;
          this.orderResponse.email = response.email;
          this.orderResponse.phone_number = response.phone_number;
          this.orderResponse.address = response.address;
          this.orderResponse.note = response.note;
          this.orderResponse.total_money = response.total_money;
          if (response.order_date) {
            this.orderResponse.order_date = new Date(
              response.order_date[0],
              response.order_date[1] - 1,
              response.order_date[2]
            );
          }

          console.log(response)

          this.orderResponse.order_details = response.order_details.map((order_detail: any) => {
            console.log("hello", order_detail)

            if (order_detail && order_detail.thumbnail) {
              order_detail.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.thumbnail}`;
            } else {
              console.log('Product or thumbnail is undefined for order detail ID:', order_detail.id);
            }

          
            order_detail.number_of_products = order_detail.number_of_products;
            
            return order_detail;
          });

          // console.log(this.orderResponse.order_details)
          
          this.orderResponse.payment_method = response.payment_method;
          if (response.shipping_date) {
            this.orderResponse.shipping_date = new Date(
              response.shipping_date[0],
              response.shipping_date[1] - 1,
              response.shipping_date[2]
            );
          }
          this.orderResponse.shipping_method = response.shipping_method;
          this.orderResponse.status = response.status;
          // debugger
        },
        complete: () => {
          // debugger;
        },
        error: (error: HttpErrorResponse) => {
          // debugger;
          console.error(error?.error?.message ?? '');
        }
      });
    }

    saveOrder(): void {
      // debugger;
      this.orderService
        .updateOrder(this.orderId, new OrderDTO(this.orderResponse))
        .subscribe({
          next: (response: ApiResponse) => {
            // debugger;
            // Hiển thị popup khi lưu thành công
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Order updated successfully!',
              confirmButtonText: 'OK'
            }).then(() => {
              // Điều hướng quay lại trang trước đó sau khi người dùng đóng popup
              this.router.navigate(['../'], { relativeTo: this.activatedRoute });
            });
          },
          complete: () => {
            // debugger;
          },
          error: (error: HttpErrorResponse) => {
            // debugger;
            console.error(error?.error?.message ?? '');

            // Hiển thị popup khi gặp lỗi
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update the order. Please try again.',
              confirmButtonText: 'OK'
            }).then(() => {
              // Điều hướng quay lại trang trước đó sau khi người dùng đóng popup
              this.router.navigate(['../'], { relativeTo: this.activatedRoute });
            });
          }
        });
    }
  }
