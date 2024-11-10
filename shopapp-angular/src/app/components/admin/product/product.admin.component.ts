import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../../base/base.component';


@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: [
    './product.admin.component.scss',        
  ],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})
export class ProductAdminComponent extends BaseComponent implements OnInit {
    selectedCategoryId: number  = 0; // Giá trị category được chọn
    products: Product[] = [];        
    currentPage: number = 0;
    itemsPerPage: number = 12;
    pages: number[] = [];
    totalPages:number = 0;
    visiblePages: number[] = [];
    keyword:string = "";
    localStorage?:Storage;
        
    constructor() {
      super();
      this.localStorage = document.defaultView?.localStorage;
    }

    
    ngOnInit() {
      this.currentPage = Number(this.localStorage?.getItem('currentProductAdminPage')) || 0; 
      this.getProducts(this.keyword, 
        this.selectedCategoryId, 
        this.currentPage, this.itemsPerPage);      
    }    
    searchProducts() {
      this.currentPage = 0;
      this.itemsPerPage = 12;
      debugger
      this.getProducts(this.keyword.trim(), this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
      debugger
      this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
        next: (apiresponse: ApiResponse) => {
          debugger
          const response = apiresponse.data;
          response.products.forEach((product: Product) => {                      
            if (product) {
              product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            }          
          });
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
          debugger;
        },
        error: (error: HttpErrorResponse) => {
          debugger;
          console.error(error?.error?.message ?? '');
        }
      });    
    }
    onPageChange(page: number) {
      debugger;
      this.currentPage = page < 0 ? 0 : page;
      this.localStorage?.setItem('currentProductAdminPage', String(this.currentPage));     
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }      
    
    // Hàm xử lý sự kiện khi thêm mới sản phẩm
    insertProduct() {
      debugger
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/admin/products/insert']);
    } 

    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    updateProduct(productId: number) {
      debugger
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/admin/products/update', productId]);
    }  
    deleteProduct(product: Product) {      
      const confirmation = window.confirm('Are you sure you want to delete this product?');
      if (confirmation) {
        debugger
        this.productService.deleteProduct(product.id).subscribe({
          next: (apiResponse: ApiResponse) => {
            debugger 
            console.error('Xóa thành công')
            location.reload();          
          },
          complete: () => {
            debugger;          
          },
          error: (error: HttpErrorResponse) => {
            debugger;
            console.error(error?.error?.message ?? '');
          }
        });  
      }      
    }      
}