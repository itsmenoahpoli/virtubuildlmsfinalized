import { AbstractControl } from '@angular/forms';

export const getErrorMessage = (
  control: AbstractControl | null,
  controlName: string
): string => {
  if (!control?.touched || !control?.errors) return '';

  if (control.errors['required']) return `${controlName} is required`;
  if (control.errors['email']) return 'Please enter a valid email';
  if (control.errors['minlength'])
    return 'Password must be at least 6 characters';

  return '';
};
