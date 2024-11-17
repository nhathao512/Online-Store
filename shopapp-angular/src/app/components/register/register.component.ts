import { Component, viewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class RegisterComponent extends BaseComponent {
  readonly registerForm = viewChild.required<NgForm>('registerForm');

  phoneNumber: string = '';
  password: string = '';
  retypePassword: string = '';
  fullName: string = '';
  address: string = '';
  isAccepted: boolean = false;
  dateOfBirth: Date = new Date();
  showPassword: boolean = false;

  constructor() {
    super();
    // Đặt mặc định là ngày hiện tại trừ 18 năm để đảm bảo không bị lỗi tuổi
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  register() {
    if (this.registerForm().valid) {
      const registerDTO: RegisterDTO = {
        fullname: this.fullName,
        phone_number: this.phoneNumber,
        address: this.address,
        password: this.password,
        retype_password: this.retypePassword,
        date_of_birth: this.dateOfBirth,
        facebook_account_id: 0,
        google_account_id: 0,
        role_id: 1
      };

      this.userService.register(registerDTO).subscribe({
        next: (apiResponse: ApiResponse) => {
          const confirmation = window.confirm('Đăng ký thành công, mời bạn đăng nhập. Bấm "OK" để chuyển đến trang đăng nhập.');
          if (confirmation) {
            this.router.navigate(['/login']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast({
            error: error,
            defaultMsg: 'Lỗi không xác định',
            title: 'Lỗi Đăng Ký'
          });
        }
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm().form.controls['retypePassword'].setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm().form.controls['retypePassword'].setErrors(null);
    }
  }
  
  checkFutureDate() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      if (birthDate > today) {
        this.registerForm().form.controls['dateOfBirth'].setErrors({ 'futureDate': true });
      } else {
        this.registerForm().form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
  checkAge() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      else if (birthDate > today) {
        this.registerForm().form.controls['dateOfBirth'].setErrors({ 'futureDate': true });
      } 
      // Xóa lỗi nếu hợp lệ
      else {
        this.registerForm().form.controls['dateOfBirth'].setErrors(null);
      }
    } else {
      // Đặt lỗi nếu trường ngày tháng năm sinh để trống
      this.registerForm().form.controls['dateOfBirth'].setErrors({ 'required': true });
    }
  }
}
