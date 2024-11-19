import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { InsertProductDTO } from '../../../../dtos/product/insert.product.dto';
import { Category } from '../../../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../../../base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insert.product.admin',
  templateUrl: './insert.product.admin.component.html',
  styleUrls: ['./insert.product.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})
export class InsertProductAdminComponent extends BaseComponent implements OnInit {
  insertProductDTO: InsertProductDTO = {
    name: '',
    price: 0,
    description: '',
    category_id: 1,
    images: []
  };
  categories: Category[] = [];

  ngOnInit() {
    this.getCategories(1, 100);
  } 

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to load catalog, please try again later.',
        });
      }
    });
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
    this.insertProductDTO.images = files;
  }

  insertProduct() {
    // Kiểm tra nếu các trường bắt buộc không có giá trị hoặc không hợp lệ
    if (!this.insertProductDTO.name || this.insertProductDTO.name.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Product name cannot be blank. Please enter product name.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    if (this.insertProductDTO.price <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Product price must be greater than 0. Please enter a valid price.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    if (!this.insertProductDTO.description || this.insertProductDTO.description.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Product description cannot be empty. Please enter a description.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    if (!this.insertProductDTO.category_id || this.insertProductDTO.category_id <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid product category. Please select a category.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    if (this.insertProductDTO.images.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select at least one photo for the product.',
      });
      return; // Dừng hàm nếu chưa chọn ảnh
    }
  
    // Nếu các trường hợp trên đều hợp lệ, thực hiện thêm sản phẩm
    this.productService.insertProduct(this.insertProductDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'The product has been added successfully.',
        }).then(() => {
          if (this.insertProductDTO.images.length > 0) {
            const productId = apiResponse.data.id;
            this.productService.uploadImages(productId, this.insertProductDTO.images).subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'The photo has been uploaded successfully.',
                }).then(() => {
                  this.router.navigate(['../'], { relativeTo: this.activatedRoute });
                });
              },
              error: () => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Photo upload failed, please try again later.',
                });
              }
            });
          } else {
            this.router.navigate(['../'], { relativeTo: this.activatedRoute });
          }
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Adding product failed, please try again later.',
        });
      }
    });
  }  
}
