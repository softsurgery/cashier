import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import { orderInitialState, OrderStateProps, orderStateStore } from './order-state.store';

@Injectable({
  providedIn: 'root',
})
export class OrderRepository extends BaseStoreRepository<OrderStateProps> {
  constructor() {
    super(orderStateStore.pipe(select((state) => state)), orderStateStore, orderInitialState);
  }
}
