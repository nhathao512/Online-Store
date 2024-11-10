import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../responses/user/user.response';
import {RouterModule} from "@angular/router";
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.scss',        
  ],  
  standalone: true,
  imports: [       
    CommonModule,    
    RouterModule,
    //FormsModule
  ],
  
  
})
export class AdminComponent extends BaseComponent implements OnInit {
  //adminComponent: string = 'orders';
  userResponse?:UserResponse | null;  
    
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();    
    // Default router
    debugger
    if (this.router.url === '/admin') {
      this.router.navigate(['/admin/orders']);
    }
   }  
  logout() {
    this.userService.removeUserFromLocalStorage();
    this.tokenService.removeToken();
    this.userResponse = this.userService.getUserResponseFromLocalStorage();    
    this.router.navigate(['/']);
  }
  showAdminComponent(componentName: string): void {
    debugger
    if (componentName === 'orders') {
      this.router.navigate(['/admin/orders']);
    } else if (componentName === 'categories') {
      this.router.navigate(['/admin/categories']);
    } else if (componentName === 'products') {
      this.router.navigate(['/admin/products']);
    } else if (componentName === 'users') {
      this.router.navigate(['/admin/users']);
    }
  }
}


/**
 npm install --save font-awesome
 angular.json:
 "styles": [   
    "node_modules/font-awesome/css/font-awesome.min.css"
],
 */