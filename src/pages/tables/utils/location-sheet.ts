import { SheetObject, SheetActionVariant } from '@/components/sheet/types';
import type { SheetAction } from '@/components/sheet/types';
import { DynamicField, DynamicForm, FieldVariant, TextFieldProps } from '@/components/form-builder/form-builder.types';
import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { BehaviorSubject } from 'rxjs';
import { Location } from '../models/location.model';

interface LocationSheetProps {
  editingLocation?: Location | null;
  locations: Location[];
  onSave: (name: string) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export function getLocationSheet({
  editingLocation,
  locations,
  onSave,
  onDelete,
  onCancel,
}: LocationSheetProps): SheetObject {
  const name$ = new BehaviorSubject(editingLocation?.name || '');

  const nameField: DynamicField<TextFieldProps> = {
    id: 'name',
    label: 'Location Name',
    variant: FieldVariant.TEXT,
    isRequired: true,
    props: {
      placeholder: 'e.g. Bar, Restaurant, Terrace',
      value: name$.asObservable(),
      onChange: (v: string) => name$.next(v),
    },
  };

  const structure: DynamicForm = {
    title: editingLocation ? 'Edit Location' : 'Add Location',
    isHeaderHidden: true,
    description: editingLocation ? '' : undefined,
    grids: [
      {
        title: '',
        isHeaderHidden: true,
        gridItems: [
          { fields: [nameField] },
        ],
      },
    ],
  };

  const actions: SheetAction[] = [
    { label: 'Cancel', variant: 'outline' as SheetActionVariant, onClick: onCancel },
    ...(editingLocation && onDelete
      ? [{ label: 'Delete', variant: 'destructive' as SheetActionVariant, onClick: onDelete }]
      : []),
    { label: editingLocation ? 'Update' : 'Add', variant: 'default' as SheetActionVariant, onClick: () => onSave(name$.value) },
  ];

  return {
    title: structure.title,
    description: editingLocation ? undefined : 'Create a new location',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  } as unknown as SheetObject; // workaround for dynamic import type
}
