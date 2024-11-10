import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  showToast({ error, defaultMsg: defaultMessage, title = '', delay = 5000 }: {
    error?: any,
    defaultMsg: string,
    title?: string,
    delay?: number
  }) {
    // Determine the message based on the error object or use the default message
    let message = defaultMessage;
    if (error && error.error && error.error.message) {
      message = error.error.message;
    } else if (error && typeof error === 'string') {
      message = error;
    }     

    // Tạo một container cho toast nếu chưa tồn tại
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.setAttribute('aria-live', 'polite');
      toastContainer.setAttribute('aria-atomic', 'true');
      toastContainer.style.position = 'fixed';
      toastContainer.style.top = '0';
      toastContainer.style.right = '0';
      toastContainer.style.padding = '20px';
      document.body.appendChild(toastContainer);
    }

    // Tạo toast element
    const toast = document.createElement('div');
    toast.classList.add('toast', 'show', 'bg-danger', 'text-white');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.minWidth = '250px';
    toast.style.marginBottom = '1rem';

    // Nội dung toast
    toast.innerHTML = `
      <div class="toast-header" style="position: relative;">
        <strong class="mr-auto">${title}</strong>
        <button type="button" 
          class="close" data-dismiss="toast" 
          aria-label="Close" 
          style="position: absolute; top: 0; right: 0; padding: 8px 12px; background-color: transparent; border: none; color: black;">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `;

    // Thêm vào container
    toastContainer.appendChild(toast);

    // Tự động ẩn sau delay
    setTimeout(() => {
      toast.classList.remove('show');
      toastContainer.removeChild(toast);
    }, delay);

    // Xử lý sự kiện đóng khi nhấn vào button close
    toast?.querySelector('.close')?.addEventListener('click', () => {
      toast.classList.remove('show');
      toastContainer.removeChild(toast);
    });
  }
}
