import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  TextareaFieldProps,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { ProductRepository } from '@/stores/product/product-state.repository';

interface ProductCreateFormStructureProps {
  store: ProductRepository;
  isUpdate?: boolean;
}

export const getProductCreateFormStructure = ({
  store,
  isUpdate = false,
}: ProductCreateFormStructureProps): DynamicForm => {
  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Name',
    variant: FieldVariant.TEXT,
    description: 'Enter the name of the product',
    isRequired: true,
    props: {
      placeholder: 'Product  Name',
      value: store.getNestedObservable<string>('createDto.name'),
      onChange: (value: string) => {
        store.setNested('createDto.name', value);
        store.setNested('errors.name', []);
      },
    },
  };

  const descriptionField: DynamicField<TextareaFieldProps> = {
    id: 'description',
    label: 'Description',
    variant: FieldVariant.TEXTAREA,
    description: 'Enter a description for the product (optional)',
    props: {
      placeholder: 'Product  Description',
      value: store.getNestedObservable<string>('createDto.description'),
      onChange: (value: string) => {
        store.setNested('createDto.description', value);
        store.setNested('errors.description', []);
      },
      rows: 10,
      resize: 'none',
    },
  };

  return {
    title: isUpdate ? 'Update Product ' : 'Create Product ',
    description: isUpdate
      ? 'Modify the fields below to update the product.'
      : 'Fill out the form below to create a new product.',
    isHeaderHidden: true,
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: [
          {
            fields: [nameField],
          },
          {
            fields: [descriptionField],
          },
        ],
      },
    ],
  };
};
