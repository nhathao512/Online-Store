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
  activeNavItem: string = 'home';
  baseImageUrl: string = 'http://localhost:8088/api/v1/users/profile-images/';

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    // Set active item based on current route
    const currentPath = this.router.url;
    if (currentPath.includes('/orders')) {
      this.activeNavItem = 'cart';
    } else {
      this.activeNavItem = 'home';
    }
  }

  getProfileImageUrl(): string {
    if (this.userResponse?.profile_image) {
      // Nếu là URL từ Google/Facebook
      if (this.userResponse.profile_image.startsWith('http')) {
        return this.userResponse.profile_image;
      }
      // Nếu là filename từ server
      return `${this.baseImageUrl}${this.userResponse.profile_image}`;
    }
    return 'assets/images/default-avatar.png';
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/user-profile']);
    }
    else if(index === 1) {
      this.router.navigate(['/manage-orders']);
    } 
    else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
      this.router.navigate(['/login']);
    }
    this.isPopoverOpen = false;
  }

  setActiveNavItem(item: string) {
    this.activeNavItem = item;
  }
}