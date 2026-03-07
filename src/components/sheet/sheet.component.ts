import { NgComponentOutlet } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { DrawerAction, DrawerObject } from './types';

@Component({
  selector: 'app-sheet',
  standalone: true,
  templateUrl: './sheet.component.html',
  styleUrl: './sheet.component.css',
  imports: [HlmSheetImports, HlmButtonImports, NgComponentOutlet],
})
export class SheetComponent {
  private readonly dialogRef = inject(BrnDialogRef);
  protected readonly context = injectBrnDialogContext<DrawerObject>();

  protected readonly actions = this.context.actions ?? [];

  private readonly disabledSignals = new Map<DrawerAction, Signal<boolean>>();

  protected isDisabled(action: DrawerAction): boolean {
    if (!action.disabled) return false;
    let sig = this.disabledSignals.get(action);
    if (!sig) {
      sig = toSignal(action.disabled, { initialValue: false });
      this.disabledSignals.set(action, sig);
    }
    return sig();
  }

  close() {
    this.context.onHide?.();
    this.dialogRef.close();
  }

  onActionClick(action: DrawerAction) {
    action.onClick();
  }
}
