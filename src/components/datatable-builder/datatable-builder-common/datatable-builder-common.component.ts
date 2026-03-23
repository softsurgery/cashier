import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { DynamicDataTable } from '../datatable-builder.types';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmDropdownMenu, HlmDropdownMenuCheckboxIndicator } from '@spartan-ng/helm/dropdown-menu';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucidePlus } from '@ng-icons/lucide';

import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';

import {
  ColumnDef,
  ColumnFiltersState,
  createAngularTable,
  FlexRenderDirective,
  flexRenderComponent,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/angular-table';
import { DatatableBuilderActionDropdownComponent } from '../core/datatable-builder-action-dropdown/datatable-builder-action-dropdown.component';
import { LayoutService } from '@/components/layout/layout.service';
import { BreadcrumbComponent } from '@/components/layout/breadcrumb/breadcrumb.component';
import { DataTablePagination } from './pagination';

@Component({
  selector: 'app-datatable-builder-common',
  templateUrl: './datatable-builder-common.component.html',
  styleUrls: ['./datatable-builder-common.component.css'],
  providers: [provideIcons({ lucideChevronDown, lucidePlus })],
  imports: [
    CommonModule,
    FormsModule,
    FlexRenderDirective,

    HlmIcon,
    HlmDropdownMenu,
    HlmDropdownMenuCheckboxIndicator,
    NgIcon,

    HlmDropdownMenuImports,
    HlmButtonImports,
    HlmIconImports,
    HlmInputImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmTableImports,
  ],
})
export class DatatableBuilderCommonComponent implements OnInit, OnDestroy {
  layoutService = inject(LayoutService);

  @Input() dataTableObject?: DynamicDataTable;
  @Input() data: Observable<any[]> = of([]);
  @Input() totalRecords = 0;
  @Input() loading = false;

  protected _data = signal<any[]>([]);
  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});

  _table!: Table<any>;
  protected _hidableColumns: any[] = [];

  _columns: ColumnDef<any>[] = [];

  protected _filterChanged(event: Event) {
    this._table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }

  protected _filterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this._table.setGlobalFilter(target.value);
  }

  ngOnInit() {
    this.initializeTable();
    this.layoutService.setFooter(DataTablePagination, {
      table: this._table,
      totalRecords: this.totalRecords,
      sizes: this.dataTableObject?.sizes || [10, 20, 50],
    });
  }

  ngOnDestroy(): void {
    this.layoutService.clearFooter();
  }

  initializeTable() {
    // Convert observable → signal
    this.data.subscribe((data) => {
      this._data.set(data);
    });

    this._columns = this.dataTableObject?.columns || [];

    // Auto-append actions column if rowActions or rowActionsFn is defined
    if (this.dataTableObject?.rowActions || this.dataTableObject?.rowActionsFn) {
      const hasActionsColumn = this._columns.some((col) => col.id === 'actions');
      if (!hasActionsColumn) {
        const rowActions = this.dataTableObject.rowActions;
        const rowActionsFn = this.dataTableObject.rowActionsFn;
        this._columns = [
          ...this._columns,
          {
            id: 'actions',
            enableHiding: false,
            cell: () =>
              flexRenderComponent(DatatableBuilderActionDropdownComponent, {
                inputs: { rowActions, rowActionsFn },
              }),
          },
        ];
      }
    }
    // Create table
    this._table = createAngularTable(() => ({
      data: this._data(),
      columns: this._columns,

      onSortingChange: (updater) =>
        updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater),

      onColumnFiltersChange: (updater) =>
        updater instanceof Function
          ? this._columnFilters.update(updater)
          : this._columnFilters.set(updater),

      onColumnVisibilityChange: (updater) =>
        updater instanceof Function
          ? this._columnVisibility.update(updater)
          : this._columnVisibility.set(updater),

      onRowSelectionChange: (updater) =>
        updater instanceof Function
          ? this._rowSelection.update(updater)
          : this._rowSelection.set(updater),

      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),

      state: {
        sorting: this._sorting(),
        columnFilters: this._columnFilters(),
        columnVisibility: this._columnVisibility(),
        rowSelection: this._rowSelection(),
      },
    }));

    // Now table exists → safe to read columns
    this._hidableColumns = this._table.getAllColumns().filter((column) => column.getCanHide());
  }
}
