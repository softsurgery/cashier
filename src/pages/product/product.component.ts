// product.component.ts
import { Component, effect, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

import { ProductService } from './product.service';
import { ProductFamilyService } from '../product-family/product-family.service';
import { SheetService } from '../../components/sheet/sheet.service';
import { DialogService } from '../../components/dialog/dialog.service';
import { CreateProductDto, ResponseProductDto } from '../../types';

import {
  DataTableServerQuery,
  DynamicDataTable,
} from '../../components/datatable-builder/datatable-builder.types';
import { getProductDataTableObject } from './utils/product.data-table';
import { getProductCreateFormStructure } from './utils/product-create.form-structure';
import { getProductCreateSheet } from './utils/product-create.sheet';
import { ProductRepository } from '@/stores/product/product-state.repository';
import { LayoutService } from '@/components/layout/layout.service';
import { createServerQuery } from '@/components/datatable-builder/server-query';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-product',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit, OnDestroy {
  private layoutService = inject(LayoutService);
  private productService = inject(ProductService);
  private productFamilyService = inject(ProductFamilyService);
  private store = inject(ProductRepository);
  private sheetService = inject(SheetService);
  private dialogService = inject(DialogService);
  private vcr = inject(ViewContainerRef);

  private sheetRef: BrnDialogRef | null = null;
  private editingId: number | null = null;

  data = new BehaviorSubject<ResponseProductDto[]>([]);
  totalRecords = new BehaviorSubject(0);
  serverQuery: DataTableServerQuery = createServerQuery({
    initialPageSize: 10,
    initialSortBy: 'updatedAt',
    initialSortOrder: 'desc',
  });

  dataTableObject: DynamicDataTable<ResponseProductDto> = getProductDataTableObject({
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

      this.loadProducts(page, size, search, sortBy, sortOrder);
    });
  }

  ngOnInit() {
    this.layoutService.setBreadcrumbs([
      {
        label: 'Administrative Tools',
        url: '',
      },
      {
        label: 'Products',
        url: '/administration/products',
      },
    ]);
    this.layoutService.setIntro('Products', 'Manage the products available in the restaurant.');
  }

  ngOnDestroy(): void {
    this.layoutService.clearBreadcrumbs();
    this.layoutService.clearIntro();
  }

  loadProducts(
    page = 0,
    size = 10,
    search = '',
    sortBy = '',
    sortOrder: 'asc' | 'desc' | '' = '',
  ) {
    this.productService
      .findAll({
        take: size,
        skip: page * size,
        order: sortBy
          ? ({
              [sortBy]: sortOrder.toUpperCase(),
            } as Record<string, 'ASC' | 'DESC'>)
          : undefined,
        relations: ['productFamily'],
      })
      .subscribe((products) => {
        this.data.next(products);
        this.totalRecords.next(products.length);
      });
  }

  openCreateSheet() {
    this.editingId = null;
    this.store.reset();

    this.productFamilyService.findAll({ take: 100, skip: 0 }).subscribe((families) => {
      const options = families.map((f) => ({ name: f.name, code: f.id }));
      const structure = getProductCreateFormStructure({
        store: this.store,
        familyOptions: options,
      });

      const sheetConfig = getProductCreateSheet({
        structure,
        onSave: () => this.onCreateSave(),
        onCancel: () => this.closeSheet(),
      });

      this.sheetRef = this.sheetService.open(this.vcr, sheetConfig);
    });
  }

  private onCreateSave() {
    const createDto = this.store.get<CreateProductDto>('createDto');

    this.productService.create(createDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadProducts();
        toast.success('Product created successfully');
      },
    });
  }

  openUpdateSheet(row: ResponseProductDto) {
    this.editingId = row.id;

    this.store.reset();
    this.store.set('createDto', {
      name: row.name,
      description: row.description,
      price: row.price,
      productFamilyId: row.productFamily.id,
    });

    this.productFamilyService.findAll({ take: 100, skip: 0 }).subscribe((families) => {
      const options = families.map((f) => ({ name: f.name, code: f.id }));

      const structure = getProductCreateFormStructure({
        store: this.store,
        isUpdate: true,
        familyOptions: options,
      });

      const sheetConfig = getProductCreateSheet({
        structure,
        title: 'Update Product',
        description: 'Modify the values below and save to update.',
        onSave: () => this.onUpdateSave(),
        onCancel: () => this.closeSheet(),
      });

      this.sheetRef = this.sheetService.open(this.vcr, sheetConfig);
    });
  }

  private onUpdateSave() {
    if (this.editingId == null) {
      return;
    }

    const updateDto = this.store.get<CreateProductDto>('createDto');
    this.productService.update(this.editingId, updateDto).subscribe({
      next: () => {
        this.closeSheet();
        this.loadProducts();
        toast.success('Product updated successfully');
      },
    });
  }

  private closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
    this.editingId = null;
  }

  private confirmDelete(row: ResponseProductDto) {
    const ref = this.dialogService.open(this.vcr, {
      title: 'Delete Product',
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
        this.productService.delete(row.id).subscribe(() => {
          this.loadProducts();
          toast.success('Product deleted successfully');
        });
      }
    });
  }
}