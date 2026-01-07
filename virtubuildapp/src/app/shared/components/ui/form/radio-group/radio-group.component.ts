import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

interface RadioOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-radio-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col gap-y-2">
      <h1 class="text-sm text-gray-800 text-center">{{ label }}</h1>
      <div class="flex flex-row justify-center gap-2">
        <label
          *ngFor="let option of options"
          class="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            [value]="option.value"
            [checked]="value === option.value"
            (change)="onRadioChange($event)"
            class="w-4 h-4 text-blue-500"
          />
          <span class="text-xs text-gray-500">{{ option.label }}</span>
        </label>
      </div>
      <div *ngIf="errorMessage" class="text-red-500 text-xs text-center">
        {{ errorMessage }}
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioGroupComponent,
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: RadioOption[] = [];
  @Input() errorMessage = '';

  value = '';
  disabled = false;
  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onRadioChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
