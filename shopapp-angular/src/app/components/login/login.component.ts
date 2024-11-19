import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { NgForm } from '@angular/forms';
import { Role } from '../../models/role';
import { UserResponse } from '../../responses/user/user.response';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';

import { tap, switchMap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ]
})
export class LoginComponent extends BaseComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  phoneNumber: string = '';
  password: string = '';
  showPassword: boolean = false;

  roles: Role[] = [];
  rememberMe: boolean = true;
  selectedRole: Role | undefined;
  userResponse?: UserResponse;

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  ngOnInit() {
    this.roleService.getRoles().subscribe({
      next: ({ data: roles }: ApiResponse) => {
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }

  createAccount() {
    this.router.navigate(['/register']);
  }

  loginWithGoogle() {
    this.authService.authenticate('google').subscribe({
      next: (url: string) => {
        window.location.href = url;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error authenticating with Google:', error?.error?.message ?? '');
      }
    });
  }

  loginWithFacebook() {
    this.authService.authenticate('facebook').subscribe({
      next: (url: string) => {
        window.location.href = url;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error authenticating with Facebook:', error?.error?.message ?? '');
      }
    });
  }

  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };

    this.userService.login(loginDTO).pipe(
      tap((apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        this.tokenService.setToken(token);
      }),
      switchMap((apiResponse: ApiResponse) => {
        const { token } = apiResponse.data;
        return this.userService.getUserDetail(token).pipe(
          tap((apiResponse2: ApiResponse) => {
            this.userResponse = {
              ...apiResponse2.data,
              date_of_birth: new Date(apiResponse2.data.date_of_birth),
            };

            // console.log("hahahaha", this.userResponse)

            if (this.rememberMe) {
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
            }

            if (this.userResponse?.role.name === 'admin') {
              this.router.navigate(['/admin']);
            } else if (this.userResponse?.role.name === 'user') {
              this.router.navigate(['/']);
            }
          }),
          catchError((error: HttpErrorResponse) => {
            console.error('Error retrieving user information:', error?.error?.message ?? '');
            return of(null); // Continue Observable chain
          })
        );
      }),
      finalize(() => {
        this.cartService.refreshCart();
      })
    ).subscribe({
      error: (error: HttpErrorResponse) => {
        console.error('Login error:', error?.error?.message ?? '');

        // Check if the error message is "Your account has been locked"
        if (error?.error?.message === 'Tài khoản của bạn đã bị khóa') {
          Swal.fire({
            icon: 'error',
            title: 'Account Locked',
            text: 'Your account has been locked, please contact support.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Error',
            text: error?.error?.message ?? 'An error occurred, please try again.',
          });
        }
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
