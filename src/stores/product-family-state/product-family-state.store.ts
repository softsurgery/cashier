import { createStore, withProps } from '@ngneat/elf';
import { CreateProductFamilyDto, UpdateProductFamilyDto } from '@/types';

export interface ProductFamilyStateProps {
  createDto: CreateProductFamilyDto;
  updateDto?: UpdateProductFamilyDto;
  errors: Record<string, string[]>;
}

export const productFamilyInitialState: ProductFamilyStateProps = {
  createDto: {
    name: '',
    description: '',
    pictureId: null,
  },
  updateDto: {
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
