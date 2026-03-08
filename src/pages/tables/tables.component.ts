import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

import { TablesService } from './tables.service';
import { TableRepository } from '../../stores/table-state/table-state.repository';
import { SheetService } from '../../components/sheet/sheet.service';
import { CreateTableDto, ResponseTableDto } from '../../types';

import { DynamicDataTable } from '../../components/datatable-builder/datatable-builder.types';
import { getTableDataTableObject } from './utils/table.data-table';
import { getTableCreateFormStructure } from './utils/table-create.form-structure';
import { getTableCreateSheet } from './utils/table-create.sheet';

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
  private vcr = inject(ViewContainerRef);

  private sheetRef: BrnDialogRef | null = null;

  data = new BehaviorSubject<ResponseTableDto[]>([]);

  dataTableObject: DynamicDataTable<ResponseTableDto> = getTableDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
  });

  ngOnInit() {
    this.loadTables();
  }

  loadTables() {
    this.tablesService
      .findAll({
        take: 10,
        skip: 0,
      })
      .subscribe((tables) => {
        this.data.next(tables);
      });
  }

  openCreateSheet() {
    this.store.reset();

    const structure = getTableCreateFormStructure({ store: this.store });

    const sheetConfig = getTableCreateSheet({
      structure,
      onSave: () => this.onCreateSave(),
      onCancel: () => this.closeSheet(),
    });

    this.sheetRef = this.sheetService.open(this.vcr, sheetConfig);
  }

  private onCreateSave() {
    const createDto = this.store.get<CreateTableDto>('createDto');

    this.tablesService.create(createDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadTables();
      },
    });
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
  }
}
