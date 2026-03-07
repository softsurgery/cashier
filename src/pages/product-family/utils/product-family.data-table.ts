import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseProductFamilyDto } from '../../../types';
import { TableHeadSortButton } from '../../../components/datatable-builder/datatable-builder-common/sort-header-button';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';

interface ProductFamilyDataTableProps {
  onCreateAction?: () => void;
}

export const getProductFamilyDataTableObject = ({
  onCreateAction,
}: ProductFamilyDataTableProps): DynamicDataTable<ResponseProductFamilyDto> => {
  return {
    singular: 'Product Family',
    plural: 'Product Families',
    variant: DataTableVariant.COMMON,
    createAction: onCreateAction
      ? { label: 'Create Product Family', action: onCreateAction }
      : undefined,
    rowActions: {
      editAction: { label: 'Update', action: (row) => console.log('Update', row) },
      deleteAction: { label: 'Delete', action: (row) => console.log('Delete', row) },
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
