import { FormBuilderComponent } from '@/components/form-builder/form-builder.component';
import { DynamicForm } from '@/components/form-builder/form-builder.types';
import { SheetAction, SheetObject } from '@/components/sheet/types';

interface ProductFamilyUpdateSheetProps {
  structure: DynamicForm;
  onUpdate: () => void;
  onCancel: () => void;
}

export const getProductFamilyUpdateSheet = ({
  structure,
  onUpdate,
  onCancel,
}: ProductFamilyUpdateSheetProps): SheetObject => {
  const actions: SheetAction[] = [
    {
      label: 'Cancel',
      variant: 'outline',
      onClick: onCancel,
    },
    {
      label: 'Update',
      variant: 'default',
      onClick: onUpdate,
    },
  ];

  return {
    title: 'Update Product Family',
    description: 'Modify the fields below to update the product family.',
    component: {
      outlet: FormBuilderComponent,
      props: { structure },
    },
    actions,
    width: '500px',
  };
};
