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
          title: 'Lỗi',
          text: `Không thể tải danh mục: ${error?.error?.message ?? 'Đã xảy ra lỗi'}`,
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
          title: 'Lỗi',
          text: `Không thể tải chi tiết sản phẩm: ${error?.error?.message ?? 'Đã xảy ra lỗi'}`,
        });
      } 
    });     
  }

  updateProduct() {
    const updateProductDTO: UpdateProductDTO = {
      name: this.updatedProduct.name,
      price: this.updatedProduct.price,
      description: this.updatedProduct.description,
      category_id: this.updatedProduct.category_id
    };
    this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Cập nhật sản phẩm thành công.',
        }).then(() => {
          this.router.navigate(['/admin/products']);
        });
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `Cập nhật sản phẩm thất bại: ${error?.error?.message ?? 'Đã xảy ra lỗi'}`,
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
        title: 'Cảnh báo',
        text: 'Vui lòng chọn tối đa 5 ảnh.',
      });
      return;
    }
    this.images = files;
    this.productService.uploadImages(this.productId, this.images).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Tải lên ảnh thành công.',
        });
        this.images = [];
        this.getProductDetails();
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: `Tải lên ảnh thất bại: ${error?.error?.message ?? 'Đã xảy ra lỗi'}`,
        });
      } 
    });
  }

  deleteImage(productImage: ProductImage) {
    Swal.fire({
      title: 'Xác nhận',
      text: 'Bạn có chắc chắn muốn xóa ảnh này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProductImage(productImage.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Xóa ảnh thành công.',
            });
            this.getProductDetails();
          },
          error: (error: HttpErrorResponse) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: `Xóa ảnh thất bại: ${error?.error?.message ?? 'Đã xảy ra lỗi'}`,
            });
          } 
        });
      }
    });
  }
}
