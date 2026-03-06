import { Injectable, ViewContainerRef } from '@angular/core';
import { BrnDialogService } from '@spartan-ng/brain/dialog';
import { AbstractDialogComponent } from './dialog.component';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private brnDialog: BrnDialogService) {}

  open(
    viewContainerRef: ViewContainerRef,
    config: { title: string; description: string; confirmText?: string; cancelText?: string },
  ) {
    return this.brnDialog.open(AbstractDialogComponent, viewContainerRef, {
      title: config.title,
      description: config.description,
      confirmText: config.confirmText || 'Save',
      cancelText: config.cancelText || 'Cancel',
    });
  }
}
