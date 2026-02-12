import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DbService } from '../services/database.service';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DB_PATHS, ALERT_MESSAGES } from '@app/utils/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-address',
  standalone: false,
  templateUrl: './new-address.component.html',
  styleUrl: './new-address.component.scss',
})
export class NewAddressComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private db = inject(DbService);
  private alert = inject(AlertService);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private destroy$ = new Subject<void>();

  addressForm!: UntypedFormGroup;
  editingAddress = false;
  clientID = '';
  isSubmitting = false;

  ngOnInit(): void {
    this.clientID = this.activatedRoute.snapshot.params['clientID'] || '';
    if (!this.clientID) {
      this.alert.error('ID de cliente no válido');
      return;
    }

    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveAddress(): void {
    if (!this.addressForm.valid) {
      this.showFormErrors();
      return;
    }

    this.isSubmitting = true;
    const newAddress = this.addressForm.value;

    this.db
      .set(DB_PATHS.CLIENT_ADDRESS(this.clientID, newAddress.id), newAddress)
      .then(() => {
        this.isSubmitting = false;
        this.alert.successBack(
          this.editingAddress
            ? ALERT_MESSAGES.ADDRESS_UPDATED
            : ALERT_MESSAGES.ADDRESS_CREATED,
        );
      })
      .catch((err) => {
        this.isSubmitting = false;
        this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
        console.error('Error saving address:', err);
      });
  }

  goBack(): void {
    this.location.back();
  }

  private initializeForm(): void {
    this.addressForm = this.fb.group({
      id: [this.generateAddressId()],
      street: ['', Validators.required],
      number: ['', Validators.required],
      paraje: ['', Validators.required],
      pueblo: ['', Validators.required],
      province: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  private checkEditMode(): void {
    const addressID = this.activatedRoute.snapshot.params['id'];
    if (addressID) {
      this.editingAddress = true;
      this.loadAddress(addressID);
    }
  }

  private loadAddress(id: string): void {
    this.db
      .object(DB_PATHS.CLIENT_ADDRESS(this.clientID, id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (address) => {
          if (address) {
            this.addressForm.patchValue(address);
          }
        },
        error: (err) => {
          this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
          console.error('Error loading address:', err);
        },
      });
  }

  private showFormErrors(): void {
    const errors = this.getFormErrors();
    const errorList = Object.entries(errors)
      .map(
        ([field, messages]) =>
          `<strong>${field}:</strong> ${(messages as string[]).join(', ')}`,
      )
      .join('<br>');

    this.alert.error(`${ALERT_MESSAGES.FORM_ERROR}<br><br>${errorList}`);
  }

  private getFormErrors(): { [key: string]: string[] } {
    const errors: { [key: string]: string[] } = {};
    const fieldLabels: { [key: string]: string } = {
      street: 'Calle',
      number: 'Número',
      paraje: 'Paraje',
      pueblo: 'Pueblo',
      province: 'Provincia',
      type: 'Tipo de dirección',
    };

    Object.keys(this.addressForm.controls).forEach((key) => {
      const control = this.addressForm.get(key);
      if (control?.errors) {
        errors[fieldLabels[key] || key] = this.getErrorMessages(
          key,
          control.errors,
        );
      }
    });

    return errors;
  }

  private getErrorMessages(fieldName: string, errors: any): string[] {
    const messages: string[] = [];

    if (errors['required']) {
      messages.push('Este campo es requerido');
    }
    if (errors['minlength']) {
      messages.push(`Mínimo ${errors['minlength'].requiredLength} caracteres`);
    }
    if (errors['maxlength']) {
      messages.push(`Máximo ${errors['maxlength'].requiredLength} caracteres`);
    }

    return messages;
  }

  private generateAddressId(): string {
    return Date.now().toString();
  }
}
