import { createStore, withProps } from '@ngneat/elf';
import { CreateTableDto, TableStatus } from '@/types';

export interface TableStateProps {
  createDto: CreateTableDto;
  errors: Record<string, string[]>;
}

export const tableInitialState: TableStateProps = {
  createDto: {
    name: '',
    status: TableStatus.AVAILABLE,
  },
  errors: {},
};

export const tableStateStore = createStore(
  { name: 'table-state' },
  withProps<TableStateProps>({
    ...tableInitialState,
  }),
);
