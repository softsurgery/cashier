import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseOrderDto } from '../../../types';
import { TableHeadSortButton } from '../../../components/datatable-builder/datatable-builder-common/sort-header-button';
import { DatatableBuilderActionDropdownComponent } from '../../../components/datatable-builder/core/datatable-builder-action-dropdown/datatable-builder-action-dropdown.component';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';

interface OrderDataTableProps {}

export const getOrderDataTableObject =
  ({}: OrderDataTableProps): DynamicDataTable<ResponseOrderDto> => {
    return {
      singular: 'Order',
      plural: 'Orders',
      variant: DataTableVariant.COMMON,
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
          accessorKey: 'amount',
          id: 'amount',
          header: '<div class="text-right">Amount</div>',
          enableSorting: false,
          cell: (info) => {
            const amount = parseFloat(info.getValue<string>());

            const formatted = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(amount);

            return `<div class="text-right">${formatted}</div>`;
          },
        },
        {
          id: 'actions',
          enableHiding: false,
          cell: () => flexRenderComponent(DatatableBuilderActionDropdownComponent),
        },
      ],
    };
  };
