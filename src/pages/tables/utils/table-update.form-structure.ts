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

interface TableUpdateFormStructureProps {
  store: TableRepository;
  zones?: Observable<SelectOption[]>;
}

export const getTableUpdateFormStructure = ({
  store,
  zones,
}: TableUpdateFormStructureProps): DynamicForm => {
  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Name',
    variant: FieldVariant.TEXT,
    description: 'Enter the name of the table',
    isRequired: true,
    props: {
      placeholder: 'Table Name',
      value: store.getNestedObservable<string>('updateDto.name'),
      onChange: (value: string) => {
        store.setNested('updateDto.name', value);
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
        .getNestedObservable<number>('updateDto.zoneId')
        .pipe(map((id: number) => id.toString())),
      onSelectChange: (code: string) => {
        store.setNested('updateDto.zoneId', Number(code));
        store.setNested('errors.zoneId', []);
      },
    },
  };
  return {
    title: 'Update Table',
    description: 'Fill out the form below to update a new table.',
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
