import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { environment } from '../../../environments/environment';
import { OrderDTO } from '../../dtos/order/order.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class OrderComponent extends BaseComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  orderForm: FormGroup;
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0;
  couponDiscount: number = 0;
  couponApplied: boolean = false;
  cart: Map<number, number> = new Map();
  orderData: OrderDTO = {
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    status: 'pending',
    note: '',
    total_money: 0,
    payment_method: 'cod',
    shipping_method: 'express',
    coupon_code: '',
    cart_items: []
  };

  constructor() {
    super();
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.email]], // Không bắt buộc, chỉ kiểm tra định dạng nếu có giá trị
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      note: [''], // Không bắt buộc
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

  ngOnInit(): void {
    this.orderData.user_id = this.tokenService.getUserId();
    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys());

    if (productIds.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Thông báo',
        text: 'Giỏ hàng của bạn đang trống.'
      });
      return;
    }

    this.productService.getProductsByIds(productIds).subscribe({
      next: (apiResponse: ApiResponse) => {
        const products: Product[] = apiResponse.data;
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: this.cart.get(productId)!
          };
        });
      },
      complete: () => {
        this.calculateTotal();
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `Không thể lấy thông tin sản phẩm: ${error?.error?.message ?? 'Đã xảy ra lỗi'}`,
        });
      }
    });
  }

  placeOrder() {
    // Kiểm tra các trường bắt buộc riêng biệt
    if (
      !this.orderForm.get('fullname')?.value ||
      !this.orderForm.get('phone_number')?.value ||
      !this.orderForm.get('address')?.value
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Thông báo',
        text: 'Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc (Họ tên, Số điện thoại, Địa chỉ).'
      });
      return;
    }
  
    // Gán giá trị từ form vào đối tượng orderData
    this.orderData = {
      ...this.orderData,
      ...this.orderForm.value
    };
    this.orderData.cart_items = this.cartItems.map(cartItem => ({
      product_id: cartItem.product.id,
      quantity: cartItem.quantity
    }));
    this.orderData.total_money = this.totalAmount;
  
    this.orderService.placeOrder(this.orderData).subscribe({
      next: (response: ApiResponse) => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đặt hàng thành công!'
        }).then(() => {
          this.cartService.clearCart();
          this.router.navigate(['/']);
        });
      },
      complete: () => {
        this.calculateTotal();
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `Lỗi khi đặt hàng: ${error?.error?.message ?? 'Đã xảy ra lỗi'}`
        });
      },
    });
  }
  

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    this.updateCartFromCartItems();
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  confirmDelete(index: number): void {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartItems.splice(index, 1);
        this.updateCartFromCartItems();
        this.calculateTotal();
      }
    });
  }

  applyCoupon(): void {
    const couponCode = this.orderForm.get('couponCode')!.value;
    if (!this.couponApplied && couponCode) {
      this.calculateTotal();
      this.couponService.calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (apiResponse: ApiResponse) => {
            this.totalAmount = apiResponse.data;
            this.couponApplied = true;
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Mã giảm giá đã được áp dụng.'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.'
            });
          }
        });
    }
  }

  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }
}
