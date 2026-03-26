import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableServerQuery,
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseOrderDto } from '../../../types';
import { TableHeadSortButton } from '../../../components/datatable-builder/core/sort-header-button';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';
import { Router } from '@angular/router';

interface OrderDataTableProps {
  router: Router;
  serverQuery?: DataTableServerQuery;
}

export const getOrderDataTableObject = ({
  router,
  serverQuery,
}: OrderDataTableProps): DynamicDataTable<ResponseOrderDto> => {
  return {
    singular: 'Order',
    plural: 'Orders',
    variant: DataTableVariant.COMMON,
    serverQuery,
    enableServerActions: true,
    createAction: {
      label: 'Create Order',
      action: () => router.navigate(['/new-client-order']),
    },
    rowActions: {
      editAction: {
        label: 'Pay/Update',
        action: (row) => {
          const id = (row as ResponseOrderDto).id;
          router.navigate(['/new-client-order/order', id]);
        },
      },
    },
    columns: [
      checkboxColumnDef,
      {
        accessorKey: 'id',
        id: 'id',
        header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: 'ID' } }),
        cell: (info) => `<span class="capitalize">${info.getValue<string>()}</span>`,
      },
      {
        accessorKey: 'status',
        id: 'Status',
        header: () => flexRenderComponent(TableHeadSortButton, { inputs: { header: '' } }),
        cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
      },
      {
        accessorKey: 'table.name',
        id: 'table',
        header: 'Table Number',
        enableSorting: false,
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
