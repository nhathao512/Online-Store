import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators,
  ValidationErrors, 
  ValidatorFn, 
  AbstractControl
} from '@angular/forms';

import { UserResponse } from '../../responses/user/user.response';
import { UpdateUserDTO } from '../../dtos/user/update.user.dto';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'user-profile',
  templateUrl: './user.profile.component.html',
  styleUrls: ['./user.profile.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,   
  ],
})
export class UserProfileComponent extends BaseComponent implements OnInit {
  userResponse?: UserResponse;  
  token:string = '';
  formBuilder: FormBuilder = inject(FormBuilder);
  

  userProfileForm: FormGroup = this.formBuilder.group({
    fullname: [''],     
    address: ['', [Validators.minLength(3)]],       
    password: ['', [Validators.minLength(3)]], 
    retype_password: ['', [Validators.minLength(3)]], 
    date_of_birth: [Date.now()],      
  }, {
    validators: this.passwordMatchValidator // Custom validator function for password match
  });
  
  ngOnInit(): void {
    debugger;
    this.token = this.tokenService.getToken();
    this.userService.getUserDetail(this.token).subscribe({
      next: (response: any) => {
        debugger;
        this.userResponse = {
          ...response.data,
          date_of_birth: new Date(response.data.date_of_birth),
        };        
        this.userProfileForm.patchValue({
          fullname: this.userResponse?.fullname || '',
          address: this.userResponse?.address || '',
          date_of_birth: this.userResponse?.date_of_birth.toISOString().substring(0, 10),
        });
  
        this.userService.saveUserResponseToLocalStorage(this.userResponse);
      },
      error: (error: HttpErrorResponse) => {
        debugger;
        console.error('Lỗi khi lấy thông tin người dùng:', error?.error?.message ?? '');
      },
    });
  }  
  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const retypedPassword = formGroup.get('retype_password')?.value;
      if (password !== retypedPassword) {
        return { passwordMismatch: true };
      }
  
      return null;
    };
  }
  save(): void {
    debugger
    if (this.userProfileForm.valid) {
      const updateUserDTO: UpdateUserDTO = {
        fullname: this.userProfileForm.get('fullname')?.value,
        address: this.userProfileForm.get('address')?.value,
        password: this.userProfileForm.get('password')?.value,
        retype_password: this.userProfileForm.get('retype_password')?.value,
        date_of_birth: this.userProfileForm.get('date_of_birth')?.value
      };
  
      this.userService.updateUserDetail(this.token, updateUserDTO)
        .subscribe({
          next: (response: any) => {
            this.userService.removeUserFromLocalStorage();
            this.tokenService.removeToken();
            this.router.navigate(['/login']);
          },
          error: (error: HttpErrorResponse) => {
            debugger;
            console.error(error?.error?.message ?? '');
          } 
        });
    } else {
      if (this.userProfileForm.hasError('passwordMismatch')) {        
        console.error('Mật khẩu và mật khẩu gõ lại chưa chính xác')
      }
    }
  }    
}

