import { createStore, withProps } from '@ngneat/elf';
import { CreateProductFamilyDto } from '@/types';

export interface ProductFamilyStateProps {
  createDto: CreateProductFamilyDto;
  errors: Record<string, string[]>;
}

export const productFamilyInitialState: ProductFamilyStateProps = {
  createDto: {
    name: '',
    description: '',
    pictureId: null,
  },
  errors: {},
};

export const productFamilyStateStore = createStore(
  { name: 'product-family-state' },
  withProps<ProductFamilyStateProps>({
    ...productFamilyInitialState,
  }),
);
