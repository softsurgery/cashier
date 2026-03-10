import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  TextareaFieldProps,
  TextFieldProps,
  SelectOption,
  CustomFieldProps,
  SearchableSelectOption,
  SelectFieldProps,
} from '@/components/form-builder/form-builder.types';
import { map, Observable } from 'rxjs';
import { ProductRepository } from '@/stores/product/product-state.repository';

interface ProductCreateFormStructureProps {
  store: ProductRepository;
  isUpdate?: boolean;
  familyOptions?: SelectOption[] | Observable<SelectOption[]>;
}

export const getProductCreateFormStructure = ({
  store,
  isUpdate = false,
  familyOptions,
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

  const familyField: DynamicField<SelectFieldProps> = {
    id: 'productFamilyId',
    label: 'Product Family',
    variant: FieldVariant.SELECT,
    description: 'Select a family for this product',
    isRequired: true,
    props: {
      options: familyOptions,
      placeholder: 'Choose a family',
      value: store.getNestedObservable<number>('createDto.productFamilyId').pipe(
        map((id: number) => {
          console.log('Value from store:', id);
          if (!id) return undefined;
          return { code: id } as SelectOption;
        }),
      ),
      onSelectChange: (option: SelectOption) => {
        const id = Number(option?.code);
        console.log('Saving as number:', id);
        store.setNested('createDto.productFamilyId', id);
        store.setNested('errors.productFamilyId', []);
      },
    },
  };

  const priceField: DynamicField<TextFieldProps> = {
    id: 'price',
    label: 'Price',
    variant: FieldVariant.TEXT,
    description: 'Enter the price of the product',
    isRequired: true,
    props: {
      placeholder: 'Product  Price',
      value: store.getNestedObservable<number>('createDto.price'),
      onChange: (value: number) => {
        store.setNested('createDto.price', value);
        store.setNested('errors.price', []);
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
            fields: [familyField],
          },
          {
            fields: [priceField],
          },
          {
            fields: [descriptionField],
          },
        ],
      },
    ],
  };
};
