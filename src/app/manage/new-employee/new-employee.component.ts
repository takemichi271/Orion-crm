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
  selector: 'app-new-employee',
  standalone: false,
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss'],
})
export class NewEmployeeComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private db = inject(DbService);
  private alert = inject(AlertService);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  employeeForm!: UntypedFormGroup;
  editingEmployee = false;
  isSubmitting = false;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveEmployee(): void {
    if (!this.employeeForm.valid) {
      this.showFormErrors();
      return;
    }

    this.isSubmitting = true;
    const newEmployee = this.employeeForm.value;

    this.db
      .set(DB_PATHS.EMPLOYEE_BY_ID(newEmployee.id), newEmployee)
      .then(() => {
        this.isSubmitting = false;
        this.alert.successBack(
          this.editingEmployee
            ? ALERT_MESSAGES.EMPLOYEE_UPDATED
            : ALERT_MESSAGES.EMPLOYEE_CREATED,
        );
      })
      .catch((err) => {
        this.isSubmitting = false;
        this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
        console.error('Error saving employee:', err);
      });
  }

  private initializeForm(): void {
    const employeeId = generateOtkId();
    this.employeeForm = this.fb.group({
      id: [employeeId],
      employeeName: ['', Validators.required],
      role: ['', Validators.required],
      mode: ['', Validators.required],
      assignedTo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)],
      ],
      status: ['Active'],
      addresses: [],
    });
  }

  private checkEditMode(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.editingEmployee = true;
      this.loadEmployee(id);
    }
  }

  private loadEmployee(id: string): void {
    this.db
      .object(DB_PATHS.EMPLOYEE_BY_ID(id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employee) => {
          if (employee) {
            this.employeeForm.patchValue(employee);
          }
        },
        error: (err) => {
          this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
          console.error('Error loading employee:', err);
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
      employeeName: 'Nombre completo',
      role: 'Cargo',
      mode: 'Modalidad',
      assignedTo: 'Asignado a',
      email: 'Email',
      phone: 'Teléfono',
    };

    Object.keys(this.employeeForm.controls).forEach((key) => {
      const control = this.employeeForm.get(key);
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
