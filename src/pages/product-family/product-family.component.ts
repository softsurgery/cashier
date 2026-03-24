// product-family.component.ts
import { Component, effect, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

import { ProductFamilyService } from './product-family.service';
import { ProductFamilyRepository } from '../../stores/product-family-state/product-family-state.repository';
import { SheetService } from '../../components/sheet/sheet.service';
import { DialogService } from '../../components/dialog/dialog.service';
import { CreateProductFamilyDto, ResponseProductFamilyDto } from '../../types';

import {
  DataTableServerQuery,
  DynamicDataTable,
} from '../../components/datatable-builder/datatable-builder.types';
import { getProductFamilyDataTableObject } from './utils/product-family.data-table';
import { getProductFamilyCreateFormStructure } from './utils/product-family-create.form-structure';
import { getProductFamilyCreateSheet } from './utils/product-family-create.sheet';
import { LayoutService } from '@/components/layout/layout.service';
import { createServerQuery } from '@/components/datatable-builder/server-query';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-product-family',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './product-family.component.html',
  styleUrl: './product-family.component.css',
})
export class ProductFamilyComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private productFamilyService = inject(ProductFamilyService);
  private store = inject(ProductFamilyRepository);
  private sheetService = inject(SheetService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private sheetRef: BrnDialogRef | null = null;
  private editingId: number | null = null;

  data = new BehaviorSubject<ResponseProductFamilyDto[]>([]);
  totalRecords = new BehaviorSubject(0);
  serverQuery: DataTableServerQuery = createServerQuery({
    initialPageSize: 10,
    initialSortBy: 'updatedAt',
    initialSortOrder: 'desc',
  });

  dataTableObject: DynamicDataTable<ResponseProductFamilyDto> = getProductFamilyDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
    onEditAction: (row) => this.openUpdateSheet(row),
    onDeleteAction: (row) => this.confirmDelete(row),
    serverQuery: this.serverQuery,
  });

  constructor() {
    effect(() => {
      const page = this.serverQuery.page();
      const size = this.serverQuery.pageSize();
      const sortBy = this.serverQuery.sortBy();
      const sortOrder = this.serverQuery.sortOrder();
      const search = this.serverQuery.search();

      this.loadProductFamilies(page, size, search, sortBy, sortOrder);
    });
  }

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      {
        label: 'Administrative Tools',
        url: '',
      },
      {
        label: 'Families',
        url: '/administration/families',
      },
    ]);
    this.layoutService.setIntro('Product Families', 'Manage the product families.');
  }

  ngOnDestroy() {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  loadProductFamilies(
    page = 0,
    size = 10,
    search = '',
    sortBy = '',
    sortOrder: 'asc' | 'desc' | '' = '',
  ) {
    this.productFamilyService
      .findAll({
        take: size,
        skip: page * size,
        order: sortBy
          ? ({
              [sortBy]: sortOrder.toUpperCase(),
            } as Record<string, 'ASC' | 'DESC'>)
          : undefined,
      })
      .subscribe((families) => {
        this.data.next(families);
        this.totalRecords.next(families.length);
      });
  }

  openCreateSheet() {
    this.editingId = null;
    this.store.reset();

    const structure = getProductFamilyCreateFormStructure({ store: this.store });

    const sheetConfig = getProductFamilyCreateSheet({
      structure,
      onSave: () => this.onCreateSave(),
      onCancel: () => this.closeSheet(),
    });

    this.sheetRef = this.sheetService.open(this.vcr, sheetConfig);
  }

  private onCreateSave() {
    const createDto = this.store.get<CreateProductFamilyDto>('createDto');

    this.productFamilyService.create(createDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadProductFamilies();
        toast.success('Product family created successfully');
      },
    });
  }

  openUpdateSheet(row: ResponseProductFamilyDto) {
    this.editingId = row.id;

    this.store.reset();
    this.store.set('createDto', {
      name: row.name,
      description: row.description,
    });

    const structure = getProductFamilyCreateFormStructure({
      store: this.store,
      isUpdate: true,
    });

    const sheetConfig = getProductFamilyCreateSheet({
      structure,
      title: 'Update Product Family',
      description: 'Modify the values below and save to update.',
      onSave: () => this.onUpdateSave(),
      onCancel: () => this.closeSheet(),
    });

    this.sheetRef = this.sheetService.open(this.vcr, sheetConfig);
  }

  private onUpdateSave() {
    if (this.editingId == null) {
      return;
    }

    const updateDto = this.store.get<CreateProductFamilyDto>('createDto');
    this.productFamilyService.update(this.editingId, updateDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadProductFamilies();
        toast.success('Product family updated successfully');
      },
    });
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
    this.editingId = null;
  }

  private confirmDelete(row: ResponseProductFamilyDto) {
    const ref = this.dialogService.open(this.vcr, {
      title: 'Delete Product Family',
      description: `Are you sure you want to delete "${row.name}"?`,
      width: '400px',
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
        this.productFamilyService.delete(row.id).subscribe(() => {
          this.loadProductFamilies();
          toast.success('Product family deleted successfully');
        });
      }
    });
  }
}
