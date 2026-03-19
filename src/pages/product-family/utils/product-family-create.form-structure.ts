import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  TextareaFieldProps,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { ProductFamilyRepository } from '@/stores/product-family-state/product-family-state.repository';

interface ProductFamilyCreateFormStructureProps {
  store: ProductFamilyRepository;
  isUpdate?: boolean;
}

export const getProductFamilyCreateFormStructure = ({
  store,
  isUpdate = false,
}: ProductFamilyCreateFormStructureProps): DynamicForm => {
  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Name',
    variant: FieldVariant.TEXT,
    description: 'Enter the name of the product family',
    isRequired: true,
    props: {
      placeholder: 'Product Family Name',
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
    description: 'Enter a description for the product family (optional)',
    props: {
      placeholder: 'Product Family Description',
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
    title: isUpdate ? 'Update Product Family' : 'Create Product Family',
    description: isUpdate
      ? 'Modify the fields below to update the product family.'
      : 'Fill out the form below to create a new product family.',
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
