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
          title: 'Lỗi',
          text: 'Không thể tải danh mục, vui lòng thử lại sau.',
        });
      }
    });
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
    this.insertProductDTO.images = files;
  }

  insertProduct() {
    // Kiểm tra nếu các trường bắt buộc không có giá trị hoặc không hợp lệ
    if (!this.insertProductDTO.name || this.insertProductDTO.name.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Tên sản phẩm không được để trống. Vui lòng nhập tên sản phẩm.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    if (this.insertProductDTO.price <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Giá sản phẩm phải lớn hơn 0. Vui lòng nhập giá hợp lệ.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    if (!this.insertProductDTO.description || this.insertProductDTO.description.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Mô tả sản phẩm không được để trống. Vui lòng nhập mô tả.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    if (!this.insertProductDTO.category_id || this.insertProductDTO.category_id <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Danh mục sản phẩm không hợp lệ. Vui lòng chọn danh mục.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    if (this.insertProductDTO.images.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Vui lòng chọn ít nhất một ảnh cho sản phẩm.',
      });
      return; // Dừng hàm nếu chưa chọn ảnh
    }
  
    // Nếu các trường hợp trên đều hợp lệ, thực hiện thêm sản phẩm
    this.productService.insertProduct(this.insertProductDTO).subscribe({
      next: (apiResponse: ApiResponse) => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Sản phẩm đã được thêm thành công.',
        }).then(() => {
          if (this.insertProductDTO.images.length > 0) {
            const productId = apiResponse.data.id;
            this.productService.uploadImages(productId, this.insertProductDTO.images).subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Thành công',
                  text: 'Ảnh đã được tải lên thành công.',
                }).then(() => {
                  this.router.navigate(['../'], { relativeTo: this.activatedRoute });
                });
              },
              error: () => {
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Tải lên ảnh thất bại, vui lòng thử lại sau.',
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
          title: 'Lỗi',
          text: 'Thêm sản phẩm thất bại, vui lòng thử lại sau.',
        });
      }
    });
  }  
}
