import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import {
  productFamilyInitialState,
  ProductFamilyStateProps,
  productFamilyStateStore,
} from './product-family-state.store';

@Injectable({
  providedIn: 'root',
})
export class ProductFamilyRepository extends BaseStoreRepository<ProductFamilyStateProps> {
  constructor() {
    super(
      productFamilyStateStore.pipe(select((state) => state)),
      productFamilyStateStore,
      productFamilyInitialState,
    );
  }
}
