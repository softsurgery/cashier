import { Component, inject, OnInit } from '@angular/core';
import { DatatableBuilderComponent } from '../../components/datatable-builder/datatable-builder.component';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ProductFamilyService } from './product-family.service';
import { ResponseProductFamilyDto } from '../../types';

import { DynamicDataTable } from '../../components/datatable-builder/datatable-builder.types';
import { getProductFamilyDataTableObject } from './utils/product-family.data-table';


@Component({
  selector: 'app-product-family',
  imports: [CommonModule, DatatableBuilderComponent],
  templateUrl: './product-family.component.html',
  styleUrl: './product-family.component.css',
})
export class ProductFamilyComponent implements OnInit {
  productFamilyService = inject(ProductFamilyService);

  data = new BehaviorSubject<ResponseProductFamilyDto[]>([]);

  dataTableObject: DynamicDataTable<ResponseProductFamilyDto> = getProductFamilyDataTableObject({});

  ngOnInit() {
    this.loadProductFamilies();
  }

  loadProductFamilies() {
    this.productFamilyService
      .findAll({
        take: 10,
        skip: 0,
      })
      .subscribe((families) => {
        this.data.next(families);
      });
  }
}
