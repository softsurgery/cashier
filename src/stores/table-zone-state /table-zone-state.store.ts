import { createStore, withProps } from '@ngneat/elf';
import { CreateTableZoneDto, TableStatus } from '@/types';

export interface TableZoneStateProps {
  createDto: CreateTableZoneDto;
  errors: Record<string, string[]>;
}

export const tableZoneInitialState: TableZoneStateProps = {
  createDto: {
    name: '',
  },
  errors: {},
};

export const tableZoneStateStore = createStore(
  { name: 'table-zone-state' },
  withProps<TableZoneStateProps>({
    ...tableZoneInitialState,
  }),
);
