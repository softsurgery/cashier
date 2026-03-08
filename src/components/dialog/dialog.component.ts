import { Component, inject, OnInit } from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-abstract-dialog',
  standalone: true,
  imports: [HlmDialogImports, HlmButtonImports],
  templateUrl: 'dialog.component.html',
  styleUrl: 'dialog.component.css',
})
export class AbstractDialogComponent {
  private dialogRef = inject(BrnDialogRef);
  protected dialogContext = injectBrnDialogContext<{
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
  }>();

  cancel() {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
