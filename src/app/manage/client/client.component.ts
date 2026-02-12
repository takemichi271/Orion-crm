import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IClient } from '@app/Model/client.model';
import { DbService } from '@app/manage/services/database.service';
import { AlertService } from '@app/manage/services/alert.service';
import { Location } from '@angular/common';
import { DB_PATHS, ALERT_MESSAGES } from '@app/utils/constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-client',
  standalone: false,
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
})
export class ClientComponent implements OnInit, OnDestroy {
  private db = inject(DbService);
  private alert = inject(AlertService);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  client: IClient | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.loadClient();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadClient(): void {
    const id = this.getClientId();
    if (!id) {
      this.alert.error('No se encontró el ID del cliente');
      return;
    }

    this.isLoading = true;
    this.db
      .object<IClient>(DB_PATHS.CLIENT_BY_ID(id))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.client = this.transformAddresses(data);
          this.isLoading = false;
        },
        error: (err) => {
          this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
          this.isLoading = false;
        },
      });
  }

  deleteClient(): void {
    const id = this.getClientId();
    if (!id) return;

    this.db.remove(DB_PATHS.CLIENT_BY_ID(id)).then(
      () => {
        this.alert.successBack(ALERT_MESSAGES.CLIENT_DELETED);
      },
      (err) => {
        this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
      },
    );
  }

  deleteAddress(clientId: string, addressId: string): void {
    this.db.remove(DB_PATHS.CLIENT_ADDRESS(clientId, addressId)).then(
      () => {
        this.alert.success(ALERT_MESSAGES.ADDRESS_DELETED);
        this.loadClient();
      },
      (err) => {
        this.alert.error(ALERT_MESSAGES.GENERIC_ERROR);
      },
    );
  }

  goBack(): void {
    this.location.back();
  }

  private getClientId(): string {
    return this.activatedRoute.snapshot.params['id'] || '';
  }

  private transformAddresses(client: IClient): IClient {
    if (
      client.addresses &&
      typeof client.addresses === 'object' &&
      !Array.isArray(client.addresses)
    ) {
      client.addresses = Object.values(client.addresses);
    }
    return client;
  }
}
