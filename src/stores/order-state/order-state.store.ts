import { createStore, withProps } from '@ngneat/elf';
import { CreateOrderDto, CreateOrderProductDto } from '@/types';

export interface OrderStateProps {
  createDto: CreateOrderDto;
  errors: Record<string, string[]>;
}

export const orderInitialState: OrderStateProps = {
  createDto: {
    tableId: undefined,
    products: [] as CreateOrderProductDto[],
    status: undefined,
    total: 0,
  },
  errors: {},
};

export const orderStateStore = createStore(
  { name: 'order-state' },
  withProps<OrderStateProps>({
    ...orderInitialState,
  }),
);
