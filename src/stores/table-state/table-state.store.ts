import { createStore, withProps } from '@ngneat/elf';
import { CreateTableDto, TableStatus, UpdateTableDto } from '@/types';

export interface TableStateProps {
  createDto: CreateTableDto;
  updateDto: UpdateTableDto;
  errors: Record<string, string[]>;
}

export const tableInitialState: TableStateProps = {
  createDto: {
    name: '',
    status: TableStatus.AVAILABLE,
    zoneId: 0,
  },
  updateDto: {
    name: '',
    status: TableStatus.AVAILABLE,
    zoneId: 0,
  },
  errors: {},
};

export const tableStateStore = createStore(
  { name: 'table-state' },
  withProps<TableStateProps>({
    ...tableInitialState,
  }),
);
