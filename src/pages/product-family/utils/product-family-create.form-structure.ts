import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  CustomFieldProps,
  TextareaFieldProps,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { PictureUploadComponent } from '@/components/picture-upload/picture-upload.component';
import { ProductFamilyRepository } from '@/stores/product-family-state/product-family-state.repository';

interface ProductFamilyCreateFormStructureProps {
  store: ProductFamilyRepository;
}

export const getProductFamilyCreateFormStructure = ({
  store,
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

  const pictureField: DynamicField<CustomFieldProps> = {
    id: 'picture',
    label: 'Picture',
    variant: FieldVariant.CUSTOM,
    description: 'Upload an image for the product family',
    props: {
      component: PictureUploadComponent,
      value: store.getNestedObservable<number | null>('createDto.pictureId'),
      onChange: (pictureId: number | null) => {
        store.setNested('createDto.pictureId', pictureId);
      },
    },
  };

  return {
    title: 'Create Product Family',
    description: 'Fill out the form below to create a new product family.',
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
          {
            fields: [pictureField],
          },
        ],
      },
    ],
  };
};
