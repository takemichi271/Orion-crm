import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]',
  standalone: false,
})
export class PhoneMaskDirective {
  private readonly MAX_DIGITS = 10;

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanedValue = this.extractDigits(input.value);
    input.value = this.formatPhoneNumber(cleanedValue);
  }

  private extractDigits(value: string): string {
    return value.replace(/\D/g, '').slice(0, this.MAX_DIGITS);
  }

  private formatPhoneNumber(digits: string): string {
    if (!digits) return '';

    const part1 = digits.slice(0, 3);
    const part2 = digits.slice(3, 6);
    const part3 = digits.slice(6, 10);

    let formatted = `(${part1}`;
    if (part2) formatted += `) ${part2}`;
    if (part3) formatted += `-${part3}`;

    return formatted;
  }
}
