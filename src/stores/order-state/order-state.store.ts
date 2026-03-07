import { createStore, withProps } from '@ngneat/elf';
import { CreateOrderDto } from '@/types';

export interface OrderStateProps {
  createDto: CreateOrderDto;
  errors: Record<string, string[]>;
}

export const orderInitialState: OrderStateProps = {
  createDto: {
    tableId: undefined,
  },
  errors: {},
};

export const orderStateStore = createStore(
  { name: 'order-state' },
  withProps<OrderStateProps>({
    ...orderInitialState,
  }),
);
