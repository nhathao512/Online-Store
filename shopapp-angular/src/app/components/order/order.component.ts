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
      email: ['', [Validators.email]], // Optional, only checks format if a value is present
      phone_number: ['', [Validators.required, Validators.minLength(10)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      note: [''], // Optional
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }

  ngOnInit(): void {
    this.orderData.user_id = this.tokenService.getUserId();
    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys());

    // Check if the cart is empty
    if (productIds.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Notification',
        text: 'Your cart is empty.',
        confirmButtonText: 'Go to Home', // Only show this button
      }).then(() => {
        // Navigate to the homepage when the 'Go to Home' button is clicked
        this.router.navigate(['/']);
      });
      return;
    }

    // Get product information in the cart
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
          title: 'Error',
          text: `Unable to retrieve product information: ${error?.error?.message ?? 'An error occurred'}`,
        });
      }
    });
  }

  placeOrder() {
    // Check mandatory fields
    if (
      !this.orderForm.get('fullname')?.value ||
      !this.orderForm.get('phone_number')?.value ||
      !this.orderForm.get('address')?.value
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Notification',
        text: 'Please make sure all required fields (Full name, Phone number, Address) are filled in.'
      });
      return;
    }

    // Assign form values to orderData object
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
        const orderId = response.data.id; // Ensure API returns the order ID
        localStorage.setItem('latestOrderId', orderId.toString());
        console.log('Order has been saved with ID:', orderId);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Order placed successfully!'
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
          title: 'Error',
          text: `Error placing order: ${error?.error?.message ?? 'An error occurred'}`
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
      title: 'Confirm',
      text: 'Are you sure you want to remove this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove product from the cart
        this.cartItems.splice(index, 1);
        this.updateCartFromCartItems();
        this.calculateTotal();

        // Check if the cart is empty after removal
        if (this.cartItems.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Notification',
            text: 'Your cart is empty.',
            confirmButtonText: 'Go to Home', // 'Go to Home' button
          }).then(() => {
            // Navigate user to the homepage when the button is clicked
            this.router.navigate(['/']);
          });
        }
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
              title: 'Success',
              text: 'Coupon applied successfully.'
            });
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'The coupon code is invalid or expired.'
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
