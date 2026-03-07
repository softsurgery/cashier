import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';

interface ProductFamilyCreateSheetProps {
  structure: DynamicForm;
  onSave: () => void;
  onCancel: () => void;
}

export const getProductFamilyCreateSheet = ({
  structure,
  onSave,
  onCancel,
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
    title: 'Create Product Family',
    description: 'Fill in the details to create a new product family.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};
