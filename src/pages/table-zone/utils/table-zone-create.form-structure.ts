import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  TextFieldProps,
} from '@/components/form-builder/form-builder.types';
import { TableZoneRepository } from '@/stores/table-zone-state /table-zone-state.repository';
interface TableZoneCreateFormStructureProps {
  store: TableZoneRepository;
}

export const getTableZoneCreateFormStructure = ({
  store,
}: TableZoneCreateFormStructureProps): DynamicForm => {
  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Name',
    variant: FieldVariant.TEXT,
    description: 'Enter the name of the table zone',
    isRequired: true,
    props: {
      placeholder: 'TableZone Name',
      value: store.getNestedObservable<string>('createDto.name'),
      onChange: (value: string) => {
        store.setNested('createDto.name', value);
        store.setNested('errors.name', []);
      },
    },
  };

  return {
    title: 'Create TableZone',
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
