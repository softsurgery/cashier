import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';

interface ProductFamilyCreateSheetProps {
  structure: DynamicForm;
  onSave: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}

export const getProductFamilyCreateSheet = ({
  structure,
  onSave,
  onCancel,
  title = 'Create Product Family',
  description = 'Fill in the details to create a new product family.',
}: ProductFamilyCreateSheetProps): SheetObject => {
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
