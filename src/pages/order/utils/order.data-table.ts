import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseOrderDto } from '../../../types';
import { TableHeadSortButton } from '../../../components/datatable-builder/datatable-builder-common/sort-header-button';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';

interface OrderDataTableProps {}

export const getOrderDataTableObject =
  ({}: OrderDataTableProps): DynamicDataTable<ResponseOrderDto> => {
    return {
      singular: 'Order',
      plural: 'Orders',
      variant: DataTableVariant.COMMON,
      createAction: { label: 'Create Order', action: () => console.log('Create Order') },
      rowActions: {
        editAction: { label: 'Update', action: (row) => console.log('Update', row) },
        deleteAction: { label: 'Delete', action: (row) => console.log('Delete', row) },
      },
      columns: [
        checkboxColumnDef,
        {
          accessorKey: 'id',
          id: 'id',
          header: 'ID',
          enableSorting: false,
          cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
        },
        {
          accessorKey: 'status',
          id: 'status',
          header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: '' } }),
          cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
        },
        {
          accessorKey: 'total',
          id: 'total',
          header: '<div class="text-right">Total TTC</div>',
          enableSorting: false,
          cell: (info) => {
            const total = parseFloat(info.getValue<string>());

            return `<div class="text-right">${total}</div>`;
          },
        },
      ],
    };
  };
