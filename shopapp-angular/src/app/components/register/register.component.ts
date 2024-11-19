import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterDTO } from '../../dtos/user/register.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';
import Swal from 'sweetalert2'; // Import SweetAlert2

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
  @ViewChild('registerForm') registerForm: NgForm | undefined;

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
    // Set default to current date minus 18 years to avoid age issues
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }

  register() {
    if (this.registerForm?.valid) {
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
          // Instead of window.confirm, use Swal.fire for English popup
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have successfully registered. Click "OK" to go to the login page.',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showToast({
            error: error,
            defaultMsg: 'Unknown Error',
            title: 'Registration Error'
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
      this.registerForm?.form.controls['retypePassword'].setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm?.form.controls['retypePassword'].setErrors(null);
    }
  }

  checkFutureDate() {
    if (this.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      if (birthDate > today) {
        this.registerForm?.form.controls['dateOfBirth'].setErrors({ 'futureDate': true });
      } else {
        this.registerForm?.form.controls['dateOfBirth'].setErrors(null);
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
      } else if (birthDate > today) {
        this.registerForm?.form.controls['dateOfBirth'].setErrors({ 'futureDate': true });
      }
      else {
        this.registerForm?.form.controls['dateOfBirth'].setErrors(null);
      }
    } else {
      this.registerForm?.form.controls['dateOfBirth'].setErrors({ 'required': true });
    }
  }
}
