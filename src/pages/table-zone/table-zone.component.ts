import { Component, effect, inject, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

import { TableZoneService } from './table-zone.service';
import { SheetService } from '../../components/sheet/sheet.service';
import { DialogService } from '../../components/dialog/dialog.service';
import { CreateTableZoneDto, ResponseTableZoneDto, UpdateTableZoneDto } from '../../types';

import {
  DataTableServerQuery,
  DynamicDataTable,
} from '../../components/datatable-builder/datatable-builder.types';
import { getTableZoneDataTableObject } from './utils/table-zone.data-table';
import { getTableZoneCreateFormStructure } from './utils/table-zone-create.form-structure';
import { getTableZoneCreateSheet } from './utils/table-zone-create.sheet';
import { LayoutService } from '@/components/layout/layout.service';
import { createServerQuery } from '@/components/datatable-builder/server-query';
import { toast } from 'ngx-sonner';
import { TableZoneRepository } from '@/stores/table-zone-state /table-zone-state.repository';

@Component({
  selector: 'app-table-zone',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './table-zone.component.html',
  styleUrl: './table-zone.component.css',
})
export class TableZoneComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private tableZoneService = inject(TableZoneService);
  private store = inject(TableZoneRepository);
  private sheetService = inject(SheetService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private sheetRef: BrnDialogRef | null = null;
  private editingId: number | null = null;

  data = new BehaviorSubject<ResponseTableZoneDto[]>([]);
  totalRecords = new BehaviorSubject(0);
  serverQuery: DataTableServerQuery = createServerQuery({
    initialPageSize: 10,
    initialSortBy: 'updatedAt',
    initialSortOrder: 'desc',
  });

  dataTableObject: DynamicDataTable<ResponseTableZoneDto> = getTableZoneDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
    onEditAction: (row) => this.openUpdateSheet(row),
    onDeleteAction: (row) => this.confirmDelete(row),
    serverQuery: this.serverQuery,
  });

  constructor() {
    let firstRun = true;

    effect(() => {
      const page = this.serverQuery.page();
      const size = this.serverQuery.pageSize();
      const sortBy = this.serverQuery.sortBy();
      const sortOrder = this.serverQuery.sortOrder();
      const search = this.serverQuery.search();

      if (firstRun) {
        firstRun = false;
        return;
      }

      this.loadTableZones(page, size, search, sortBy, sortOrder);
    });
  }

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      {
        label: 'Administrative Tools',
        url: '',
      },
      {
        label: 'Table Zones',
        url: '/administration/table-zone',
      },
    ]);
    this.layoutService.setIntro('Table Zones', 'Manage the table zones in the restaurant.');
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  loadTableZones(
    page = 0,
    size = 10,
    search = '',
    sortBy = '',
    sortOrder: 'asc' | 'desc' | '' = '',
  ) {
    this.tableZoneService
      .findAll({
        take: size,
        skip: page * size,
        order: sortBy
          ? ({
              [sortBy]: sortOrder.toUpperCase(),
            } as Record<string, 'ASC' | 'DESC'>)
          : undefined,
      })
      .subscribe((zones) => {
        this.data.next(zones);
        this.totalRecords.next(zones.length);
      });
  }

  openCreateSheet() {
    this.editingId = null;
    this.store.reset();

    const structure = getTableZoneCreateFormStructure({ store: this.store });

    const sheetConfig = getTableZoneCreateSheet({
      structure,
      onSave: () => this.onCreateSave(),
      onCancel: () => this.closeSheet(),
    });

    this.sheetRef = this.sheetService.open(this.vcr, sheetConfig);
  }

  private onCreateSave() {
    const createDto = this.store.get<CreateTableZoneDto>('createDto');

    this.tableZoneService.create(createDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadTableZones();
        toast.success('Table zone created successfully');
      },
    });
  }

  openUpdateSheet(row: ResponseTableZoneDto) {
    this.editingId = row.id;

    this.store.reset();
    this.store.set('createDto', {
      name: row.name,
    });

    const structure = getTableZoneCreateFormStructure({
      store: this.store,
    });

    const sheetConfig = getTableZoneCreateSheet({
      structure,
      onSave: () => this.onUpdateSave(),
      onCancel: () => this.closeSheet(),
    });

    const updatedSheetConfig = {
      ...sheetConfig,
      title: 'Update Table Zone',
      description: 'Modify the fields below to update the table zone.',
    };

    this.sheetRef = this.sheetService.open(this.vcr, updatedSheetConfig);
  }

  private onUpdateSave() {
    if (this.editingId == null) {
      return;
    }

    const updateDto = this.store.get<UpdateTableZoneDto>('createDto');
    this.tableZoneService.update(this.editingId, updateDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadTableZones();
        toast.success('Table zone updated successfully');
      },
    });
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
    this.editingId = null;
  }

  private confirmDelete(row: ResponseTableZoneDto) {
    const ref = this.dialogService.open(this.vcr, {
      title: 'Delete Table Zone',
      description: `Are you sure you want to delete "${row.name}"?`,
      actions: [
        {
          label: 'Cancel',
          variant: 'outline',
          onClick: () => ref.close(),
        },
        {
          label: 'Delete',
          variant: 'destructive',
          onClick: () => ref.close(true),
        },
      ],
    });

    ref.closed$.subscribe((confirmed) => {
      if (confirmed) {
        this.tableZoneService.delete(row.id).subscribe(() => {
          this.loadTableZones();
          toast.success('Table zone deleted successfully');
        });
      }
    });
  }
}
