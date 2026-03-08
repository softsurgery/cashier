import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import { tableInitialState, TableStateProps, tableStateStore } from './table-state.store';

@Injectable({
  providedIn: 'root',
})
export class TableRepository extends BaseStoreRepository<TableStateProps> {
  constructor() {
    super(tableStateStore.pipe(select((state) => state)), tableStateStore, tableInitialState);
  }
}
