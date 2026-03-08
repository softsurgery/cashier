import { createStore } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities } from '@ngneat/elf-entities';
import { Table } from '../models/table.model';
import { mockTables } from '../mock-data';
import { Observable } from 'rxjs';

export const tablesStore = createStore(
  { name: 'tables' },
  withEntities<Table>()
);

tablesStore.update(setEntities(mockTables));

export const tables$ = tablesStore.pipe(selectAllEntities()) as Observable<Table[]>;

export function addTable(table: Table) {
  tablesStore.update(addEntities(table));
}

export function updateTable(id: string, changes: Partial<Table>) {
  tablesStore.update(updateEntities(id, changes));
}

export function deleteTable(id: string) {
  tablesStore.update(deleteEntities(id));
}
