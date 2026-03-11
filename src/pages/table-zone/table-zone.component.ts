import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

import { TableZoneService } from './table-zone.service';
import { SheetService } from '../../components/sheet/sheet.service';
import { DialogService } from '../../components/dialog/dialog.service';
import { CreateTableZoneDto, ResponseTableZoneDto, UpdateTableZoneDto } from '../../types';

import { DynamicDataTable } from '../../components/datatable-builder/datatable-builder.types';
import { getTableZoneDataTableObject } from './utils/table-zone.data-table';
import { getTableZoneCreateFormStructure } from './utils/table-zone-create.form-structure';
import { getTableZoneCreateSheet } from './utils/table-zone-create.sheet';
import { TableZoneRepository } from '@/stores/table-zone-state /table-zone-state.repository';

@Component({
  selector: 'app-table-zone',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './table-zone.component.html',
  styleUrl: './table-zone.component.css',
})
export class TableZoneComponent implements OnInit {
  private tableZoneService = inject(TableZoneService);
  private store = inject(TableZoneRepository);
  private sheetService = inject(SheetService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private sheetRef: BrnDialogRef | null = null;
  private editingId: number | null = null;

  data = new BehaviorSubject<ResponseTableZoneDto[]>([]);

  dataTableObject: DynamicDataTable<ResponseTableZoneDto> = getTableZoneDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
    onEditAction: (row) => this.openUpdateSheet(row),
    onDeleteAction: (row) => this.confirmDelete(row),
  });

  ngOnInit() {
    this.loadTables();
  }

  loadTables() {
    this.tableZoneService
      .findAll({
        take: 10,
        skip: 0,
      })
      .subscribe((tables) => {
        this.data.next(tables);
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
        this.loadTables();
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
        this.loadTables();
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
          this.loadTables();
        });
      }
    });
  }
}
