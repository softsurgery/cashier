import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { TableRepository } from '@/stores/table-state/table-state.repository';

interface TableCreateFormStructureProps {
  store: TableRepository;
}

export const getTableCreateFormStructure = ({
  store,
}: TableCreateFormStructureProps): DynamicForm => {
  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Name',
    variant: FieldVariant.TEXT,
    description: 'Enter the name of the table',
    isRequired: true,
    props: {
      placeholder: 'Table Name',
      value: store.getNestedObservable<string>('createDto.name'),
      onChange: (value: string) => {
        store.setNested('createDto.name', value);
        store.setNested('errors.name', []);
      },
    },
  };

  return {
    title: 'Create Table',
    description: 'Fill out the form below to create a new table.',
    isHeaderHidden: true,
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: [
          {
            fields: [nameField],
          },
        ],
      },
    ],
  };
};
