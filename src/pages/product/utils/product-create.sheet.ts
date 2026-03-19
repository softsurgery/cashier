import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';

interface ProductCreateSheetProps {
  structure: DynamicForm;
  onSave: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const getProductCreateSheet = ({
  structure,
  onSave,
  onCancel,
  title = 'Create Product',
  description = 'Fill in the details to create a new product.',
}: ProductCreateSheetProps): SheetObject => {
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
    title,
    description,
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};
