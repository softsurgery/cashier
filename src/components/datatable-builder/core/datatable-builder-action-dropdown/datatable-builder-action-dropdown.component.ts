import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-datatable-builder-action-dropdown',
  imports: [HlmButtonImports, NgIcon, HlmIconImports, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsis })],
  templateUrl: './datatable-builder-action-dropdown.component.html',
  styleUrls: ['./datatable-builder-action-dropdown.component.css'],
})
export class DatatableBuilderActionDropdownComponent {
  private readonly _context = injectFlexRenderContext<CellContext<any, unknown>>();

  copyPaymentId() {
    const payment = this._context.row.original;
    navigator.clipboard.writeText(payment.id);
  }
}
