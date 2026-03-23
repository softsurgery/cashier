import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseProductFamilyDto } from '../../../types';
import { TableHeadSortButton } from '../../../components/datatable-builder/core/sort-header-button';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';

interface ProductFamilyDataTableProps {
  onCreateAction?: () => void;
  onEditAction?: (row: ResponseProductFamilyDto) => void;
  onDeleteAction?: (row: ResponseProductFamilyDto) => void;
}

export const getProductFamilyDataTableObject = ({
  onCreateAction,
  onEditAction,
  onDeleteAction,
}: ProductFamilyDataTableProps): DynamicDataTable<ResponseProductFamilyDto> => {
  return {
    singular: 'Product Family',
    plural: 'Product Families',
    variant: DataTableVariant.COMMON,
    createAction: onCreateAction
      ? { label: 'Create Product Family', action: onCreateAction }
      : undefined,
    rowActions: {
      editAction: {
        label: 'Update',
        action: onEditAction ? onEditAction : (row) => console.log('Update', row),
      },
      deleteAction: {
        label: 'Delete',
        action: onDeleteAction ? onDeleteAction : (row) => console.log('Delete', row),
      },
    },
    columns: [
      checkboxColumnDef,

      {
        accessorKey: 'name',
        id: 'name',
        header: () =>
          flexRenderComponent(TableHeadSortButton, {
            inputs: { header: 'Name' },
          }),
        cell: (info) => `<div class="capitalize">${info.getValue<string>()}</div>`,
      },
      {
        accessorKey: 'description',
        id: 'description',
        header: 'Description',
        enableSorting: false,
        cell: (info) => `<div>${info.getValue<string>() ?? ''}</div>`,
      },
    ],
  };
};
