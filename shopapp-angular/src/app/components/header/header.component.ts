import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../responses/user/user.response';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';  
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [    
    CommonModule,
    NgbModule,
    RouterModule
  ]
})
export class HeaderComponent extends BaseComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    //console.error(`Clicked on "${index}"`);
    if (index === 0) {
      debugger
      this.router.navigate(['/user-profile']);
    }
    else if (index === 1) {
      // Lấy `orderId` của đơn hàng mới nhất từ dịch vụ hoặc localStorage
      const latestOrderId = localStorage.getItem('latestOrderId'); // Hoặc gọi từ `orderService` nếu cần
  
      if (latestOrderId) {
        this.router.navigate([`/orders/${latestOrderId}`]);
      } else {
        console.error('Không tìm thấy đơn hàng mới nhất');
      }
    } 
    else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item    
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
    //console.error(this.activeNavItem);
  }
}
