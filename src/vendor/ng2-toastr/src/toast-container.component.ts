import {Component, Optional, Inject} from '@angular/core';
import {Toast} from './toast';
import {ToastOptions} from './toast-options';

@Component({
  selector: 'toast-container',
  template: `
    <div id="toast-container" [style.position]="position" class="{{positionClass}}">
      <div *ngFor="let toast of toasts" class="toast-{{toast.type}}" (click)="dismiss(toast)">
        <div *ngIf="toast.title" class="{{titleClass}}">{{toast.title}}</div>
        <div class="{{messageClass}}">{{toast.message}}</div>
      </div>
    </div>
    `,
})
export class ToastContainer {
  position = 'fixed';
  messageClass = 'toast-message';
  titleClass = 'toast-title';
  positionClass = 'toast-top-right';
  toasts: Toast[] = [];
  maxShown = 5;
  autoDismiss = true;

  constructor(@Optional() @Inject(ToastOptions) options) {
    if (options) {
      Object.assign(this, options);
    }
  }

  addToast(toast: Toast) {
    if (this.positionClass.indexOf('top') > 0) {
      this.toasts.push(toast);
      if (this.toasts.length > this.maxShown) {
        this.toasts.splice(0, (this.toasts.length - this.maxShown));
      }
    } else {
      this.toasts.unshift(toast);
      if (this.toasts.length > this.maxShown) {
        this.toasts.splice(this.maxShown, (this.toasts.length - this.maxShown));
      }
    }

  }

  removeToast(toastId: number) {
    this.toasts = this.toasts.filter((toast) => {
      return toast.id !== toastId;
    });
  }

  dismiss(toast) {
    if (!this.autoDismiss) {
      this.removeToast(toast.id);
    }
  }

  anyToast(): boolean {
    return this.toasts.length > 0;
  }

  findToast(toastId: number): Toast {
    for (let toast of this.toasts) {
      if (toast.id === toastId) {
        return toast;
      }
    }
    return null;
  }
}
