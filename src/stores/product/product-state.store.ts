import { createStore, withProps } from '@ngneat/elf';
import { CreateProductDto } from '@/types';

export interface ProductStateProps {
  createDto: CreateProductDto;
  errors: Record<string, string[]>;
}

export const productInitialState: ProductStateProps = {
  createDto: {
    name: '',
    description: '',
    productFamilyId: 0,
    price: 0,
  },
  errors: {},
};

export const productStateStore = createStore(
  { name: 'product-state' },
  withProps<ProductStateProps>({
    ...productInitialState,
  }),
);
