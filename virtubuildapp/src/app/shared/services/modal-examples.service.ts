import { Injectable } from '@angular/core';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root'
})
export class ModalExamplesService {

  constructor(private modalService: ModalService) {}

  // Example: Confirm delete for any entity
  confirmDeleteEntity(entityType: string, entityName: string, onConfirm: () => void): void {
    this.modalService.confirmDelete(
      `Delete ${entityType}`,
      `Are you sure you want to delete this ${entityType.toLowerCase()}? This action cannot be undone.`,
      entityName,
      onConfirm
    );
  }

  // Example: Show success after delete
  showDeleteSuccess(entityType: string): void {
    this.modalService.showDeleteSuccess(entityType);
  }

  // Example: Show custom success message
  showCustomSuccess(title: string, message: string): void {
    this.modalService.showSuccess({
      title,
      message,
      icon: 'check_circle'
    });
  }

  // Example: Show error message
  showError(title: string, message: string): void {
    this.modalService.showSuccess({
      title,
      message,
      icon: 'error'
    });
  }
}
