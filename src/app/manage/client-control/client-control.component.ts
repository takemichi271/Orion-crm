import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Client } from '@app/Model/client.model';
import { DbService } from '@app/manage/services/database.service';
import { DB_PATHS, ALERT_MESSAGES } from '@app/utils/constants';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-client-control',
  standalone: false,
  templateUrl: './client-control.component.html',
  styleUrl: './client-control.component.scss',
})
export class ClientControlComponent implements OnInit, OnDestroy {
  private db = inject(DbService);
  private destroy$ = new Subject<void>();

  clients: Client[] = [];
  searchControl = new FormControl('');
  isLoading = false;

  ngOnInit(): void {
    this.loadClients();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadClients(): void {
    this.isLoading = true;
    this.db
      .list<Client>(DB_PATHS.CLIENTS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.clients = this.transformClients(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading clients:', err);
          this.isLoading = false;
        },
      });
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(startWith(''), debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        // Trigger change detection
      });
  }

  getFilteredClients(): Client[] {
    const searchTerm = (this.searchControl.value || '').toLowerCase();

    if (!searchTerm.trim()) {
      return this.clients;
    }

    return this.clients.filter(
      (client) =>
        client.clientName.toLowerCase().includes(searchTerm) ||
        client.id.toLowerCase().includes(searchTerm),
    );
  }

  trackByClientId(index: number, client: Client): string {
    return client.id;
  }

  private transformClients(data: Client[]): Client[] {
    return data.map((client) => {
      if (
        client.addresses &&
        typeof client.addresses === 'object' &&
        !Array.isArray(client.addresses)
      ) {
        client.addresses = Object.values(client.addresses);
      } else if (!client.addresses) {
        client.addresses = [];
      }
      return client;
    });
  }
}
