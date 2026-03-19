import { Component, inject, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';

import { ProductService } from './product.service';
import { ProductFamilyService } from '../product-family/product-family.service';
import { SheetService } from '../../components/sheet/sheet.service';
import { DialogService } from '../../components/dialog/dialog.service';
import { CreateProductDto, ResponseProductDto } from '../../types';

import { DynamicDataTable } from '../../components/datatable-builder/datatable-builder.types';
import { getProductDataTableObject } from './utils/product.data-table';
import { getProductCreateFormStructure } from './utils/product-create.form-structure';
import { getProductCreateSheet } from './utils/product-create.sheet';
import { ProductRepository } from '@/stores/product/product-state.repository';
import { LayoutService } from '@/components/layout/layout.service';

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

  dataTableObject: DynamicDataTable<ResponseProductDto> = getProductDataTableObject({
    onCreateAction: () => this.openCreateSheet(),
    onEditAction: (row) => this.openUpdateSheet(row),
    onDeleteAction: (row) => this.confirmDelete(row),
  });

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
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.layoutService.clearBreadcrumbs();
  }

  loadProducts() {
    this.productService
      .findAll({
        take: 10,
        skip: 0,
        relations: ['productFamily'],
      })
      .subscribe((products) => {
        this.data.next(products);
      });
  }

  openCreateSheet() {
    this.editingId = null;
    this.store.reset();

    // load families for dropdown
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
      },
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
      description: `Are you sure you want to delete \"${row.name}\"?`,
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
        });
      }
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
        description: 'Modiy the values below and save to update.',
        onSave: () => this.onUpdateSave(),
        onCancel: () => this.closeSheet(),
      });

      this.sheetRef = this.sheetService.open(this.vcr, sheetConfig);
    });
  }
}
