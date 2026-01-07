import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmDeleteData {
  title: string;
  message: string;
  itemName: string;
  onConfirm: () => void;
}

export interface SuccessData {
  title: string;
  message: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private confirmDeleteSubject = new BehaviorSubject<ConfirmDeleteData | null>(null);
  private successSubject = new BehaviorSubject<SuccessData | null>(null);

  public confirmDelete$ = this.confirmDeleteSubject.asObservable();
  public success$ = this.successSubject.asObservable();

  showConfirmDelete(data: ConfirmDeleteData): void {
    this.confirmDeleteSubject.next(data);
  }

  hideConfirmDelete(): void {
    this.confirmDeleteSubject.next(null);
  }

  showSuccess(data: SuccessData): void {
    this.successSubject.next(data);
  }

  hideSuccess(): void {
    this.successSubject.next(null);
  }

  confirmDelete(title: string, message: string, itemName: string, onConfirm: () => void): void {
    this.showConfirmDelete({
      title,
      message,
      itemName,
      onConfirm
    });
  }

  showDeleteSuccess(itemName: string): void {
    this.showSuccess({
      title: 'Data Deleted Successfully',
      message: `${itemName} has been deleted successfully.`,
      icon: 'check_circle'
    });
  }
}
