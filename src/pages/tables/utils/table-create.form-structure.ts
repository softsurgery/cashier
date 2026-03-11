import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  SelectFieldProps,
  SelectOption,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { TableRepository } from '@/stores/table-state/table-state.repository';
import { map, Observable } from 'rxjs';

interface TableCreateFormStructureProps {
  store: TableRepository;
  zones: Observable<SelectOption[]>;
}

export const getTableCreateFormStructure = ({
  store,
  zones,
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

  const zoneField: DynamicField<SelectFieldProps> = {
    id: 'zoneId',
    label: 'Zone',
    variant: FieldVariant.SELECT,
    description: 'Select a zone for this table',
    isRequired: true,
    props: {
      options: zones,
      placeholder: 'Choose a zone',
      value: store
        .getNestedObservable<number>('createDto.zoneId')
        .pipe(map((id: number) => id.toString())),
      onSelectChange: (code: string) => {
        store.setNested('createDto.zoneId', Number(code));
        store.setNested('errors.zoneId', []);
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
          {
            fields: [zoneField],
          },
        ],
      },
    ],
  };
};
