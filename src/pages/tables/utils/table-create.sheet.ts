import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';

interface TableCreateSheetProps {
  structure: DynamicForm;
  onSave: () => void;
  onCancel: () => void;
}

export const getTableCreateSheet = ({
  structure,
  onSave,
  onCancel,
}: TableCreateSheetProps): SheetObject => {
  const actions: SheetAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: onCancel,
    },
    {
      label: 'Save',
      variant: 'default',
      onClick: onSave,
    },
  ];

  return {
    title: 'Create Table',
    description: 'Fill in the details to create a new table.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};
