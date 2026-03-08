import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Table } from './models/table.model';
import { Location } from './models/location.model';

export interface TableManagerData {
  editingTable?: Table | null;
  locations: Location[];
}

@Component({
  selector: 'app-table-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.editingTable ? 'Edit Table' : 'Add New Table' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Table Number</mat-label>
          <input matInput formControlName="number" placeholder="e.g., 1, 2, A1">
          <mat-error *ngIf="form.get('number')?.hasError('required')">Table number is required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Location</mat-label>
          <mat-select formControlName="locationId">
            <mat-option *ngFor="let loc of data.locations" [value]="loc.id">{{ loc.name }}</mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('locationId')?.hasError('required')">Location is required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Capacity</mat-label>
          <input matInput type="number" min="1" max="20" formControlName="capacity">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button *ngIf="data.editingTable" color="warn" (click)="onDelete()">Delete</button>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="onSubmit()">
        {{ data.editingTable ? 'Update' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: ['.full-width { width: 100%; margin-bottom: 1rem; }']
})
export class TableManagerComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TableManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TableManagerData
  ) {
    this.form = this.fb.group({
      number: [data.editingTable?.number || '', Validators.required],
      locationId: [data.editingTable?.locationId || (data.locations[0]?.id || ''), Validators.required],
      capacity: [data.editingTable?.capacity || 4, [Validators.min(1), Validators.max(20)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        action: 'submit',
        number: this.form.value.number,
        locationId: this.form.value.locationId,
        capacity: this.form.value.capacity
      });
    }
  }
  onCancel(): void { this.dialogRef.close({ action: 'cancel' }); }
  onDelete(): void { this.dialogRef.close({ action: 'delete' }); }
}
