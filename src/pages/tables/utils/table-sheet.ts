import { SheetObject, SheetActionVariant } from '@/components/sheet/types';
import type { SheetAction } from '@/components/sheet/types';
import { Observable } from 'rxjs';
import {
  DynamicField,
  DynamicForm,
  FieldVariant,
  TextFieldProps,
  NumberFieldProps,
  SelectFieldProps,
} from '@/components/form-builder/form-builder.types';
import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Table } from '../models/table.model';
import { Location } from '../models/location.model';

interface TableSheetProps {
  editingTable?: Table | null;
  locations: Location[];
  onSave: (table: { number: string; locationId: string; capacity: number }) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export function getTableSheet({
  editingTable,
  locations,
  onSave,
  onDelete,
  onCancel,
}: TableSheetProps): SheetObject {
  const number$ = new BehaviorSubject(editingTable?.number || '');
  const locationId$ = new BehaviorSubject(editingTable?.locationId || (locations[0]?.id || ''));
  const capacity$ = new BehaviorSubject(editingTable?.capacity ?? 4);

  // select options
  const options = locations.map((loc) => ({ name: loc.name, code: loc.id }));

  const numberField: DynamicField<TextFieldProps> = {
    id: 'number',
    label: 'Table Number',
    variant: FieldVariant.TEXT,
    isRequired: true,
    props: {
      placeholder: '1, 2, A1',
      value: number$.asObservable(),
      onChange: (v: string) => number$.next(v),
    },
  };

  // turn the simple id stream into a SelectOption stream for the form builder
  const locationValue$ = locationId$.asObservable().pipe(
    map(id => options.find(o => o.code === id)),
  );

  const locationField: DynamicField<SelectFieldProps> = {
    id: 'locationId',
    label: 'Location',
    variant: FieldVariant.CUSTOM, // custom because the builder has no dedicated select variant
    props: {
      options,
      value: locationValue$ as Observable<any>,
      onSelectChange: (opt) => {
        locationId$.next(opt.code as string);
      },
    },
    isRequired: true,
  };

  const capacityField: DynamicField<NumberFieldProps> = {
    id: 'capacity',
    label: 'Capacity',
    variant: FieldVariant.NUMBER,
    props: {
      placeholder: 'Seats',
      value: capacity$.asObservable(),
      onChange: (v: number) => capacity$.next(v),
      min: 1,
      max: 20,
    },
  };

  const structure: DynamicForm = {
    title: editingTable ? 'Edit Table' : 'Add Table',
    isHeaderHidden: true,
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: [
          { fields: [numberField] },
          { fields: [locationField] },
          { fields: [capacityField] },
        ],
      },
    ],
  };

  const actions: SheetAction[] = [
    { label: 'Cancel', variant: 'outline' as SheetActionVariant, onClick: onCancel },
    ...(editingTable && onDelete
      ? [{ label: 'Delete', variant: 'destructive' as SheetActionVariant, onClick: onDelete }]
      : []),
    {
      label: editingTable ? 'Update' : 'Add',
      variant: 'default' as SheetActionVariant,
      onClick: () =>
        onSave({
          number: number$.value,
          locationId: locationId$.value,
          capacity: capacity$.value,
        }),
    },
  ];

  return {
    title: structure.title,
    description: editingTable ? '' : 'Create a new table',
    component: { outlet: FormBuilderComponent, props: { structure } },
    actions,
    width: '500px',
  };}
