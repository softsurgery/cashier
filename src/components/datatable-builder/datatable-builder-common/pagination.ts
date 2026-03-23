import { Component, Input } from '@angular/core';
import { Table } from '@tanstack/angular-table';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmToggleImports } from '@spartan-ng/helm/toggle';

@Component({
  selector: 'app-data-table-pagination',
  standalone: true,
  imports: [HlmToggleImports, HlmButtonImports],
  template: `
    <div class="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
      @if (table && table.getRowCount() > 0) {
        @if (sizes?.length) {
          <div class="flex flex-row gap-2">
            @for (size of sizes; track size) {
              <button
                hlmToggle
                type="button"
                [state]="table.getState().pagination.pageSize === size ? 'on' : 'off'"
                (click)="setPageSize(size)"
              >
                {{ size }}
              </button>
            }
          </div>
        }

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div class="text-muted-foreground text-sm">
            {{ table.getSelectedRowModel().rows.length }} of {{ table.getRowCount() }} row(s)
            selected
          </div>

          <div class="flex space-x-2">
            <button
              size="sm"
              variant="outline"
              hlmBtn
              [disabled]="!table.getCanPreviousPage()"
              (click)="table.previousPage()"
              type="button"
            >
              Previous
            </button>

            <button
              size="sm"
              variant="outline"
              hlmBtn
              [disabled]="!table.getCanNextPage()"
              (click)="table.nextPage()"
              type="button"
            >
              Next
            </button>
          </div>
        </div>
      } @else {
        <div class="flex h-full w-full items-center justify-center">
          <div class="text-muted-foreground text-sm">No Data</div>
        </div>
      }
    </div>
  `,
})
export class DataTablePagination<T> {
  @Input() totalRecords = 0;
  @Input() sizes?: number[];
  @Input() table!: Table<T>;

  setPageSize(size: number) {
    this.table?.setPageSize(size);
  }
}
