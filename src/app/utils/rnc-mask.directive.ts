import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appRncMask]',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RncMaskDirective),
      multi: true,
    },
  ],
})
export class RncMaskDirective implements ControlValueAccessor {
  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;

    let value = input.value.replace(/\D/g, '');

    value = value.substring(0, 9);

    input.value = this.formatRnc(value);

    this.onChange(this.formatRnc(value));
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: string): void {
    if (value) {
      const clean = value.replace(/\D/g, '');
      this.el.nativeElement.value = this.formatRnc(clean);
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

  private formatRnc(value: string): string {
    if (!value) return '';

    const parts = [
      value.substring(0, 1),
      value.substring(1, 3),
      value.substring(3, 8),
      value.substring(8, 9),
    ].filter(Boolean);

    return parts.join('-');
  }
}
