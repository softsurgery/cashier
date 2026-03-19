import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { TableHeadSortButton } from '../../../components/datatable-builder/datatable-builder-common/sort-header-button';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';
import { ResponseProductDto } from '../../../types';

interface ProductDataTableProps {
  onCreateAction?: () => void;
  onEditAction?: (row: ResponseProductDto) => void;
  onDeleteAction?: (row: ResponseProductDto) => void;
}

export const getProductDataTableObject = ({
  onCreateAction,
  onEditAction,
  onDeleteAction,
}: ProductDataTableProps): DynamicDataTable<ResponseProductDto> => {
  return {
    singular: 'Product',
    plural: 'Products',
    variant: DataTableVariant.COMMON,
    createAction: onCreateAction ? { label: 'Create Product', action: onCreateAction } : undefined,
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
        cell: (info) => `${info.getValue<string>() ?? ''}</div>`,
      },
      {
        accessorKey: 'price',
        id: 'price',
        header: () =>
          flexRenderComponent(TableHeadSortButton, {
            inputs: { header: 'Price' },
          }),
        cell: (info) => `<div>د.ت ${info.getValue<number>()?.toFixed(2) ?? '0.00'}</div>`,
      },
      {
        accessorFn: (row) => row.productFamily?.name,
        id: 'productFamily',
        header: () =>
          flexRenderComponent(TableHeadSortButton, {
            inputs: { header: 'Product Family' },
          }),
        cell: (info) => `<div>${info.getValue<string>() ?? ''}</div>`,
      },
    ],
  };
};
