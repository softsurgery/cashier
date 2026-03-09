import { Injectable } from '@angular/core';
import { BaseStoreRepository } from '../base-store.repository';
import { select } from '@ngneat/elf';
import { tableZoneStateStore, TableZoneStateProps, tableZoneInitialState } from './table-zone-state.store';
@Injectable({
  providedIn: 'root',
})
export class TableZoneRepository extends BaseStoreRepository<TableZoneStateProps> {
  constructor() {
    super(tableZoneStateStore.pipe(select((state) => state)), tableZoneStateStore, tableZoneInitialState);
  }
}
