import { Component, inject, OnInit } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ResponseProductDto } from '../../types';

import { DynamicDataTable } from '../../components/datatable-builder/datatable-builder.types';
import { getProductDataTableObject } from './utils/product.data-table';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  productService = inject(ProductService);

  data = new BehaviorSubject<ResponseProductDto[]>([]);

  dataTableObject: DynamicDataTable<ResponseProductDto> = getProductDataTableObject({});

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService
      .findAll({
        take: 10,
        skip: 0,
      })
      .subscribe((products) => {
        this.data.next(products);
      });
  }
}
