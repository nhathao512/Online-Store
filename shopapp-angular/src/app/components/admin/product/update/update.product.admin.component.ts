import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { environment } from '../../../../../environments/environment';
import { ProductImage } from '../../../../models/product.image';
import { UpdateProductDTO } from '../../../../dtos/product/update.product.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../../../base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail.product.admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})

export class UpdateProductAdminComponent extends BaseComponent implements OnInit {  
  categories: Category[] = [];
  currentImageIndex: number = 0;
  images: File[] = [];
  productId: number = 0;
  product: Product = {} as Product;
  updatedProduct: Product = {} as Product;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      this.getProductDetails();
    });
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Unable to load catalog: ${error?.error?.message ?? 'An error has occurred'}`,
        });
      } 
    });
  }

  getProductDetails(): void {
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.product = apiResponse.data;
        this.updatedProduct = { ...apiResponse.data };                
        this.updatedProduct.product_images.forEach((product_image: ProductImage) => {
          product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
        });
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Unable to load product details: ${error?.error?.message ?? 'An error has occurred'}`,
        });
      } 
    });     
  }

  updateProduct() {
    // Kiểm tra các trường hợp chưa điền đầy đủ thông tin hoặc giá không hợp lệ
    if (!this.updatedProduct.name || !this.updatedProduct.description || !this.updatedProduct.category_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please fill in all product information before updating.',
      });
      return;
    }
  
    if (this.updatedProduct.price <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Product price must be greater than 0.',
      });
      return;
    }
  
    const updateProductDTO: UpdateProductDTO = {
      name: this.updatedProduct.name,
      price: this.updatedProduct.price,
      description: this.updatedProduct.description,
      category_id: this.updatedProduct.category_id
    };
  
    // Gọi API để cập nhật sản phẩm
    this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product update successful.',
        }).then(() => {
          this.router.navigate(['/admin/products']);
        });
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Product update failed: ${error?.error?.message ?? 'An error has occurred'}`,
        });
      }
    });
  }
  

  showImage(index: number): void {
    if (this.product && this.product.product_images && this.product.product_images.length > 0) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }  

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }  

  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select up to 5 photos.',
      });
      return;
    }
    this.images = files;
    this.productService.uploadImages(this.productId, this.images).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Upload photo successfully.',
        });
        this.images = [];
        this.getProductDetails();
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Photo upload failed: ${error?.error?.message ?? 'An error has occurred'}`,
        });
      } 
    });
  }

  deleteImage(productImage: ProductImage) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this photo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProductImage(productImage.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Deleted photos successfully.',
            });
            this.getProductDetails();
          },
          error: (error: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Delete photo failed: ${error?.error?.message ?? 'An error has occurred'}`,
            });
          } 
        });
      }
    });
  }
}
