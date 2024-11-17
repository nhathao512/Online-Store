import { Component, OnInit } from '@angular/core';
import { Category } from '../../../../models/category';
import { UpdateCategoryDTO } from '../../../../dtos/category/update.category.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../../../base/base.component';
import Swal from 'sweetalert2'; // Import SweetAlert2 for popups

@Component({
  selector: 'app-detail.category.admin',
  templateUrl: './update.category.admin.component.html',
  styleUrls: ['./update.category.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})

export class UpdateCategoryAdminComponent extends BaseComponent implements OnInit {
  categoryId: number = 0;
  updatedCategory: Category = {} as Category;

  ngOnInit(): void {    
    this.activatedRoute.paramMap.subscribe(params => {
      this.categoryId = Number(params.get('id'));
      this.getCategoryDetails();
    });
  }
  
  getCategoryDetails(): void {
    this.categoryService.getDetailCategory(this.categoryId).subscribe({
      next: (apiResponse: ApiResponse) => {        
        this.updatedCategory = { ...apiResponse.data };                        
      },
      complete: () => {
        // Handle any logic after completion if needed
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      } 
    });     
  }

  // Method to update the category
  updateCategory() {
    const updateCategoryDTO: UpdateCategoryDTO = {
      name: this.updatedCategory.name,      
    };
    this.categoryService.updateCategory(this.updatedCategory.id, updateCategoryDTO).subscribe({
      next: (response: any) => {
        // Success notification with SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Danh mục đã được cập nhật thành công!',
        }).then(() => {
          // After the success popup, navigate to the category list
          this.router.navigate(['/admin/categories']);
        });
      },
      complete: () => {
        // Handle any logic after completion if needed
      },
      error: (error: HttpErrorResponse) => {
        // Error handling if update fails
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể cập nhật danh mục, vui lòng thử lại.',
        });
        console.error(error?.error?.message ?? '');
      } 
    });  
  }  
}
