import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TableCardComponent } from './table-card.component';
import { Location } from './models/location.model';
import { Table, TableStatus } from './models/table.model';

@Component({
  selector: 'app-location-section',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TableCardComponent
  ],
  template: `
    <div class="location-section">
      <div class="location-header">
        <h2>{{ location.name }}</h2>
        <div class="location-actions">
          <button mat-icon-button (click)="editLocation.emit(location)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="deleteLocation.emit(location.id)"><mat-icon>delete</mat-icon></button>
        </div>
      </div>
      <div *ngIf="locationTables.length > 0; else noTables" class="tables-grid">
        <app-table-card
          *ngFor="let table of locationTables"
          [table]="table"
          (edit)="editTable.emit($event)"
          (delete)="deleteTable.emit($event)"
          (statusChange)="statusChange.emit($event)"
        ></app-table-card>
      </div>
      <ng-template #noTables>
        <div class="no-tables">No tables in this location</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .location-section { margin-bottom: 2rem; }
    .location-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .location-header h2 { font-size: 1.5rem; font-weight: 600; margin: 0; }
    .location-actions { display: flex; gap: 8px; }
    .tables-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .no-tables { text-align: center; padding: 2rem; color: #6b7280; background: #f9fafb; border-radius: 0.5rem; }
    :host-context(.dark) .no-tables { background: #1f2937; color: #9ca3af; }
  `]
})
export class LocationSectionComponent {
  @Input() location!: Location;
  @Input() tables: Table[] = [];
  @Output() editTable = new EventEmitter<Table>();
  @Output() deleteTable = new EventEmitter<string>();
  @Output() statusChange = new EventEmitter<{ id: string; status: TableStatus }>();
  @Output() editLocation = new EventEmitter<Location>();
  @Output() deleteLocation = new EventEmitter<string>();

  get locationTables(): Table[] {
    return this.tables.filter(t => t.locationId === this.location.id);
  }
}
