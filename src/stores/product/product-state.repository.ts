import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import { productInitialState, ProductStateProps, productStateStore } from './product-state.store';

@Injectable({
  providedIn: 'root',
})
export class ProductRepository extends BaseStoreRepository<ProductStateProps> {
  constructor() {
    super(productStateStore.pipe(select((state) => state)), productStateStore, productInitialState);
  }
}
