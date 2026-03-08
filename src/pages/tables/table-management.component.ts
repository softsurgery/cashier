import { Component, inject, ViewContainerRef } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

// uuid types were causing errors; use built-in crypto

import { Location } from './models/location.model';
import { Table, TableStatus } from './models/table.model';
import { locations$, tables$, addLocation, updateLocation, deleteLocation, addTable, updateTable, deleteTable } from './state';
import { LocationSectionComponent } from './location-section.component';
import { SheetService } from '@/components/sheet/sheet.service';
import { DialogService } from '@/components/dialog/dialog.service';
import { getLocationSheet } from './utils/location-sheet';
import { getTableSheet } from './utils/table-sheet';

@Component({
  selector: 'app-table-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    LocationSectionComponent
  ],
  template: `
    <div class="container">
      <div class="actions" style="padding:1rem 2rem; display:flex; gap:1rem;">
        <button mat-raised-button color="primary" (click)="openLocationDialog()">
          <mat-icon>add</mat-icon> Add Location
        </button>
        <button mat-raised-button color="accent" (click)="openTableDialog()"
                [disabled]="(locations$ | async)?.length === 0">
          <mat-icon>add</mat-icon> Add Table
        </button>
      </div>

      <main *ngIf="(locations$ | async)?.length; else noLocations">
        <app-location-section
          *ngFor="let location of locations$ | async"
          [location]="location"
          [tables]="(tables$ | async) ?? []"
          (editTable)="openTableDialog($event)"
          (deleteTable)="onDeleteTable($event)"
          (statusChange)="onStatusChange($event)"
          (editLocation)="openLocationDialog($event)"
          (deleteLocation)="onDeleteLocation($event)"
        ></app-location-section>
      </main>

      <ng-template #noLocations>
        <div class="no-locations">
          <p>No locations created yet. Start by adding a location.</p>
          <button mat-raised-button color="primary" (click)="openLocationDialog()">
            <mat-icon>add</mat-icon> Add Your First Location
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
    .container { min-height: 100vh }
    :host-context(.dark) .container { background: linear-gradient(135deg, #111827, #1f2937); }
    .header { position: sticky; top: 0; background: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; z-index: 10; }
    .header h1 { font-size: 2rem; font-weight: 700; margin: 0; }
    .header p { color: #6b7280; margin: 0; }
    .actions { display: flex; gap: 1rem; }
    main { max-width: 1280px; margin: 2rem auto; padding: 0 1rem; }
    .no-locations { text-align: center; padding: 3rem; }
  `
  ]
})
export class TableManagementComponent {
  locations$: Observable<Location[]> = locations$ as Observable<Location[]>;
  tables$: Observable<Table[]> = tables$ as Observable<Table[]>;

  // inject helpers (standalone components can use inject)
  private sheetService = inject(SheetService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private sheetRef: any | null = null;

  // Location sheet
  openLocationDialog(location?: Location): void {
    const locs = this.getCurrentLocations();
    const sheetObj = getLocationSheet({
      editingLocation: location || null,
      locations: locs,
      onSave: (name: string) => {
        if (location) {
          updateLocation(location.id, name);
        } else {
          addLocation({ id: crypto.randomUUID(), name });
        }
        this.sheetRef?.close();
      },
      onDelete: location
        ? () => {
            if (
              confirm(`Delete location "${location.name}"? This will also delete all tables in this location.`)
            ) {
              this.getTablesByLocationId(location.id).forEach((t) => deleteTable(t.id));
              deleteLocation(location.id);
              this.sheetRef?.close();
            }
          }
        : undefined,
      onCancel: () => this.sheetRef?.close(),
    });

    this.sheetRef = this.sheetService.open(this.vcr, sheetObj);
  }

  // Table sheet
  openTableDialog(table?: Table): void {
    const locs = this.getCurrentLocations();
    const sheetObj = getTableSheet({
      editingTable: table || null,
      locations: locs,
      onSave: (t: { number: string; locationId: string; capacity: number }) => {
        if (table) {
          updateTable(table.id, {
            number: t.number,
            locationId: t.locationId,
            capacity: t.capacity,
          });
        } else {
          addTable({
            id: crypto.randomUUID(),
            number: t.number,
            locationId: t.locationId,
            status: 'blank',
            capacity: t.capacity,
          });
        }
        this.sheetRef?.close();
      },
      onDelete: table
        ? () => {
            if (confirm('Delete this table?')) {
              deleteTable(table.id);
              this.sheetRef?.close();
            }
          }
        : undefined,
      onCancel: () => this.sheetRef?.close(),
    });

    this.sheetRef = this.sheetService.open(this.vcr, sheetObj);
  }

  onDeleteTable(id: string): void {
    this.dialogService
      .open(this.vcr, {
        title: 'Delete table',
        description: 'Are you sure you want to delete this table?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      .closed$
      .subscribe((confirmed?: boolean) => {
        if (confirmed) deleteTable(id);
      });
  }

  onStatusChange(event: { id: string; status: TableStatus }): void {
    updateTable(event.id, { status: event.status });
  }

  onDeleteLocation(id: string): void {
    const location = this.getLocationById(id);
    if (!location) return;
    this.dialogService
      .open(this.vcr, {
        title: 'Delete location',
        description: `Delete location "${location.name}"? This will also delete all tables in this location.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      .closed$
      .subscribe((confirmed?: boolean) => {
        if (confirmed) {
          this.getTablesByLocationId(id).forEach((t) => deleteTable(t.id));
          deleteLocation(id);
        }
      });
  }

  // Helpers to get current values from observables (synchronous for dialog data)
  private getCurrentLocations(): Location[] {
    let locs: Location[] = [];
    this.locations$.subscribe(l => locs = l).unsubscribe();
    return locs;
  }

  private getLocationById(id: string): Location | undefined {
    return this.getCurrentLocations().find(l => l.id === id);
  }

  private getTablesByLocationId(locationId: string): Table[] {
    let tables: Table[] = [];
    this.tables$.subscribe(ts => tables = ts.filter(t => t.locationId === locationId)).unsubscribe();
    return tables;
  }
}
