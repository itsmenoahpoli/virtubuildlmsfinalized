# Global Modal System Usage Guide

This guide explains how to use the global modal system for confirm delete dialogs and success notifications.

## Components Included

### 1. Confirm Delete Modal
- **Component**: `ConfirmDeleteModalComponent`
- **Purpose**: Shows a confirmation dialog before deleting records
- **Features**: 
  - Warning icon
  - Customizable title and message
  - Shows the item name being deleted
  - Cancel and Delete buttons

### 2. Success Modal
- **Component**: `SuccessModalComponent`
- **Purpose**: Shows success notifications after operations
- **Features**:
  - Success icon (check_circle by default)
  - Customizable title and message
  - Auto-closes after 3 seconds
  - OK button to close manually

## Services

### ModalService
- **Location**: `@/app/shared/services/modal.service`
- **Purpose**: Manages global modal state
- **Methods**:
  - `confirmDelete(title, message, itemName, onConfirm)` - Show confirm delete modal
  - `showDeleteSuccess(itemName)` - Show delete success modal
  - `showSuccess(data)` - Show custom success modal
  - `hideConfirmDelete()` - Hide confirm delete modal
  - `hideSuccess()` - Hide success modal

## Usage Examples

### Basic Delete Confirmation

```typescript
import { ModalService } from '@/app/shared/services/modal.service';

constructor(private modalService: ModalService) {}

deleteItem(item: any) {
  this.modalService.confirmDelete(
    'Delete Item',
    'Are you sure you want to delete this item? This action cannot be undone.',
    item.name,
    () => this.performDelete(item.id)
  );
}

private async performDelete(id: number) {
  try {
    await this.service.delete(id);
    this.modalService.showDeleteSuccess('Item');
  } catch (error) {
    this.modalService.showSuccess({
      title: 'Delete Failed',
      message: 'Failed to delete item. Please try again.',
      icon: 'error'
    });
  }
}
```

### Custom Success Message

```typescript
this.modalService.showSuccess({
  title: 'Operation Successful',
  message: 'Your changes have been saved successfully.',
  icon: 'check_circle'
});
```

### Error Message

```typescript
this.modalService.showSuccess({
  title: 'Error',
  message: 'Something went wrong. Please try again.',
  icon: 'error'
});
```

## Integration in Components

### 1. Import the ModalService
```typescript
import { ModalService } from '@/app/shared/services/modal.service';
```

### 2. Inject in Constructor
```typescript
constructor(private modalService: ModalService) {}
```

### 3. Update Delete Methods
Replace `confirm()` and `alert()` calls with modal service calls.

### 4. Update HTML Templates
Pass the full object instead of just the ID:
```html
<!-- Before -->
<button (click)="deleteItem(item.id)">Delete</button>

<!-- After -->
<button (click)="deleteItem(item)">Delete</button>
```

## Global Availability

The modal components are automatically available globally through the `AppComponent`. No additional imports are needed in individual components.

## Styling

Both modals use consistent styling with:
- Semi-transparent backdrop
- Centered modal container
- Material Icons for icons
- Responsive design
- Hover effects on buttons

## Best Practices

1. **Always show confirmation** for destructive actions
2. **Provide clear messages** about what will be deleted
3. **Show success feedback** after successful operations
4. **Handle errors gracefully** with appropriate error messages
5. **Use descriptive titles** and item names
6. **Test modal behavior** on different screen sizes

## Icons Available

- `check_circle` - Success (default)
- `error` - Error
- `warning` - Warning
- `info` - Information

## Auto-close Behavior

- Success modals auto-close after 3 seconds
- Confirm delete modals require user interaction
- Both can be closed by clicking the backdrop or close button
