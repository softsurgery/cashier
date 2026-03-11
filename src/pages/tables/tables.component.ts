import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

import { TablesService } from './tables.service';
import { TableRepository } from '../../stores/table-state/table-state.repository';
import { SheetService } from '../../components/sheet/sheet.service';
import { CreateTableDto, ResponseTableDto, UpdateTableDto } from '../../types';

import { DynamicDataTable } from '../../components/datatable-builder/datatable-builder.types';
import { getTableDataTableObject } from './utils/table.data-table';
import { getTableCreateFormStructure } from './utils/table-create.form-structure';
import { getTableCreateSheet } from './utils/table-create.sheet';
import { DialogService } from '@/components/dialog/dialog.service';
import { TableZoneService } from '../table-zone/table-zone.service';
import { toast } from 'ngx-sonner';
import { getTableUpdateFormStructure } from './utils/table-update.form-structure';
import { SelectOption } from '@/components/form-builder/form-builder.types';

@Component({
  selector: 'app-tables',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.css',
})
export class TablesComponent implements OnInit {
  private tablesService = inject(TablesService);
  private store = inject(TableRepository);
  private sheetService = inject(SheetService);
  private tableZoneService = inject(TableZoneService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private editingId: number | null = null;
  private sheetRef: BrnDialogRef | null = null;

  data = new BehaviorSubject<ResponseTableDto[]>([]);

  dataTableObject: DynamicDataTable<ResponseTableDto> = getTableDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
    onEditAction: (row) => this.openUpdateSheet(row),
    onDeleteAction: (row) => this.handleDelete(row),
  });

  zones = new BehaviorSubject<SelectOption[]>([]);

  ngOnInit() {
    this.loadTables();
  }

  loadTables() {
    this.tablesService
      .findAll({
        take: 10,
        skip: 0,
        relations: ['zone'],
      })
      .subscribe((tables) => {
        this.data.next(tables);
      });
  }

  loadTableZones() {
    this.tableZoneService.findAll({ take: 100, skip: 0 }).subscribe((zones) => {
      const options = zones.map((zone) => ({ name: zone.name, code: zone.id }));
      this.zones.next(options);
    });
  }

  private handleCreate() {
    const createDto = this.store.get<CreateTableDto>('createDto');

    this.tablesService.create(createDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadTables();
        toast.success('Table created successfully');
      },
    });
  }

  private handleUpdate() {
    if (this.editingId == null) {
      return;
    }

    const updateDto = this.store.get<UpdateTableDto>('updateDto');
    this.tablesService.update(this.editingId, updateDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadTables();
        toast.success('Table updated successfully');
      },
    });
  }

  private handleDelete(row: ResponseTableDto) {
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
        this.tablesService.delete(row.id).subscribe(() => {
          this.loadTables();
          toast.success('Table deleted successfully');
        });
      }
    });
  }

  openCreateSheet() {
    this.store.reset();

    this.tableZoneService.findAll({ take: 100, skip: 0 }).subscribe((zones) => {
      const options = zones.map((zone) => ({ name: zone.name, code: zone.id }));
      const structure = getTableCreateFormStructure({
        store: this.store,
        zoneOptions: options,
      });

      const sheetConfig = getTableCreateSheet({
        structure,
        onSave: () => this.handleCreate(),
        onCancel: () => this.closeSheet(),
      });

      this.sheetRef = this.sheetService.open(this.vcr, sheetConfig);
    });
  }

  openUpdateSheet(row: ResponseTableDto) {
    this.editingId = row.id;

    this.store.reset();
    this.store.set('updateDto', {
      name: row.name,
      zoneId: row.zoneId,
    });

    const structure = getTableUpdateFormStructure({
      store: this.store,
    });

    const sheetConfig = getTableCreateSheet({
      structure,
      onSave: () => this.handleUpdate(),
      onCancel: () => this.closeSheet(),
    });

    const updatedSheetConfig = {
      ...sheetConfig,
      title: 'Update Table Zone',
      description: 'Modify the fields below to update the table zone.',
    };

    this.sheetRef = this.sheetService.open(this.vcr, updatedSheetConfig);
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
  }
}
