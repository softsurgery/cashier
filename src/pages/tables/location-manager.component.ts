import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Location } from './models/location.model';

export interface LocationManagerData {
  editingLocation?: Location | null;
  locations: Location[];
}

@Component({
  selector: 'app-location-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatListModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.editingLocation ? 'Edit Location' : 'Add New Location' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Location Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g., Bar, Restaurant, Terrace">
          <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
        </mat-form-field>
      </form>
      <div *ngIf="!data.editingLocation && data.locations.length > 0" class="current-locations">
        <h3>Current Locations</h3>
        <mat-list>
          <mat-list-item *ngFor="let loc of data.locations">{{ loc.name }}</mat-list-item>
        </mat-list>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button *ngIf="data.editingLocation" color="warn" (click)="onDelete()">Delete</button>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="onSubmit()">
        {{ data.editingLocation ? 'Update' : 'Add' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 1rem; }
    .current-locations { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; }
  `]
})
export class LocationManagerComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LocationManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LocationManagerData
  ) {
    this.form = this.fb.group({
      name: [data.editingLocation?.name || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({ action: 'submit', name: this.form.value.name });
    }
  }
  onCancel(): void { this.dialogRef.close({ action: 'cancel' }); }
  onDelete(): void { this.dialogRef.close({ action: 'delete' }); }
}
