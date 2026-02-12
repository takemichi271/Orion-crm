import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneMaskDirective),
      multi: true,
    },
  ],
})
export class PhoneMaskDirective implements ControlValueAccessor {
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = this.el.nativeElement;

    let value = input.value.replace(/\D/g, '');

    // 👇 Si está vacío, permitir borrar completamente
    if (!value) {
      input.value = '';
      this.onChange('');
      return;
    }

    value = value.substring(0, 10);

    const formatted = this.formatPhone(value);

    input.value = formatted;

    // Guarda limpio
    this.onChange(this.formatPhone(value));
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const cursorPos = input.selectionStart;

    // Si intenta borrar el paréntesis de cierre
    if (event.key === 'Backspace' && cursorPos === 5) {
      event.preventDefault();

      // Quitar último número del área
      let value = input.value.replace(/\D/g, '');
      value = value.substring(0, value.length - 1);

      const formatted = this.formatPhone(value);

      input.value = formatted;
      this.onChange(value);
    }
  }

  writeValue(value: string): void {
    if (value) {
      const clean = value.replace(/\D/g, '');
      this.el.nativeElement.value = this.formatPhone(clean);
    } else {
      this.el.nativeElement.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  private formatPhone(value: string): string {
    if (!value) return '';

    const area = value.substring(0, 3);
    const prefix = value.substring(3, 6);
    const line = value.substring(6, 10);

    let formatted = '';

    if (area.length > 0) {
      formatted = '(' + area;
    }

    // 👇 Solo cerrar paréntesis si ya completó 3 números
    if (area.length === 3) {
      formatted += ')';
    }

    if (prefix.length > 0) {
      formatted += '-' + prefix;
    }

    if (line.length > 0) {
      formatted += '-' + line;
    }

    return formatted;
  }
}
