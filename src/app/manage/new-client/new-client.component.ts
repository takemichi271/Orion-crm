import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { generateOtkId } from '@app/utils/id-generator';
import { DbService } from '@app/manage/services/database.service';
import { AlertService } from '@app/manage/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DB_PATHS, ALERT_MESSAGES } from '@app/utils/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-new-client',
  standalone: false,
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
})
export class NewClientComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private db = inject(DbService);
  private alert = inject(AlertService);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  clientForm!: UntypedFormGroup;
  editingClient = false;
  isSubmitting = false;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onImageError(): void {
    this.alert.error('No se pudo cargar la imagen. Verifica la URL.');
  }

  saveClient(): void {
    if (!this.clientForm.valid) {
      this.showFormErrors();
      return;
    }

    this.isSubmitting = true;
    const newClient = this.clientForm.value;

    this.db
      .set(DB_PATHS.CLIENT_BY_ID(newClient.id), newClient)
      .then(() => {
        this.isSubmitting = false;
        this.alert.successBack(
          this.editingClient
            ? ALERT_MESSAGES.CLIENT_UPDATED
            : ALERT_MESSAGES.CLIENT_CREATED,
        );
      })
      .catch((err) => {
        this.isSubmitting = false;
        this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
      });
  }

  private initializeForm(): void {
    const clientId = generateOtkId();
    this.clientForm = this.fb.group({
      id: [clientId],
      clientName: ['', Validators.required],
      enterpriseName: ['', Validators.required],
      rnc: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      status: ['Active'],
      addresses: [],
      imageUrl: ['', Validators.required],
    });
  }

  private checkEditMode(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.editingClient = true;
      this.loadClient(id);
    }
  }

  private loadClient(id: string): void {
    this.db
      .object(DB_PATHS.CLIENT_BY_ID(id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (client) => {
          if (client) {
            this.clientForm.patchValue(client);
          }
        },
        error: (err) => {
          this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
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
      clientName: 'Nombre completo',
      role: 'Cargo',
      mode: 'Modalidad',
      assignedTo: 'Asignado a',
      email: 'Email',
      phone: 'Teléfono',
    };

    Object.keys(this.clientForm.controls).forEach((key) => {
      const control = this.clientForm.get(key);
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
    if (errors['email']) {
      messages.push('Email inválido');
    }
    if (errors['pattern']) {
      if (fieldName === 'phone') {
        messages.push('El teléfono debe tener el formato (XXX) XXX-XXXX');
      } else {
        messages.push('Formato inválido');
      }
    }
    if (errors['minlength']) {
      messages.push(`Mínimo ${errors['minlength'].requiredLength} caracteres`);
    }
    if (errors['maxlength']) {
      messages.push(`Máximo ${errors['maxlength'].requiredLength} caracteres`);
    }

    return messages;
  }

  goBack(): void {
    this.location.back();
  }
}
