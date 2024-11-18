import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { InsertCategoryDTO } from '../../../../dtos/category/insert.category.dto';
import { Category } from '../../../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../../../base/base.component';
import Swal from 'sweetalert2'; // Import SweetAlert2 for popups

@Component({
  selector: 'app-insert.category.admin',
  templateUrl: './insert.category.admin.component.html',
  styleUrls: ['./insert.category.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,    
  ]
})
export class InsertCategoryAdminComponent extends BaseComponent implements OnInit {
  insertCategoryDTO: InsertCategoryDTO = {
    name: '',    
  };
  route: ActivatedRoute = inject(ActivatedRoute);  
  categories: Category[] = []; // Dữ liệu động từ categoryService  

  ngOnInit() {
    // Initialize component if necessary
  }   

  // Method to insert a new category
  insertCategory() {
    // Kiểm tra nếu tên danh mục trống hoặc không hợp lệ
    if (!this.insertCategoryDTO.name || this.insertCategoryDTO.name.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Tên danh mục không được để trống. Vui lòng nhập tên danh mục.',
      });
      return; // Dừng hàm nếu dữ liệu không hợp lệ
    }
  
    // Trước tiên, kiểm tra nếu danh mục đã tồn tại
    this.categoryService.checkCategoryExists(this.insertCategoryDTO.name).subscribe({
      next: (exists) => {
        // Log kết quả trả về từ API
        console.log('checkCategoryExists response:', exists);
  
        // Kiểm tra nếu danh mục tồn tại hay không
        if (exists.message === "Category exists") {
          // Nếu danh mục đã tồn tại, hiển thị popup lỗi
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Danh mục này đã tồn tại. Vui lòng chọn tên khác!',
          });
        } else {
          // Nếu danh mục chưa tồn tại, thực hiện việc thêm danh mục
          this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
            next: (response) => {
              // Thông báo thành công
              Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Danh mục đã được thêm mới thành công!',
              }).then(() => {
                // Sau khi popup thành công, điều hướng đến danh sách danh mục
                this.router.navigate(['/admin/categories']);
              });
            },
            error: (error: HttpErrorResponse) => {
              // Xử lý lỗi khi thêm danh mục không thành công
              Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể thêm danh mục, vui lòng thử lại.',
              });
              console.error(error?.error?.message ?? '');
            }
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        // Log lỗi nếu có khi gọi API kiểm tra danh mục tồn tại
        console.error('Error while checking category existence:', error);
  
        // Xử lý lỗi khi gọi API kiểm tra danh mục tồn tại
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể kiểm tra danh mục, vui lòng thử lại.',
        });
        console.error(error?.error?.message ?? '');
      }
    });
  }
  
  
}
