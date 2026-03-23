import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseTableDto } from '../../../types';
import { TableHeadSortButton } from '../../../components/datatable-builder/core/sort-header-button';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';
import { DataTableBadgeCell } from '../../../components/datatable-builder/core/badge-cell';

interface TableDataTableProps {
  onCreateAction?: () => void;
  onEditAction?: (row: ResponseTableDto) => void;
  onDeleteAction?: (row: ResponseTableDto) => void;
}

export const getTableDataTableObject = ({
  onCreateAction,
  onEditAction,
  onDeleteAction,
}: TableDataTableProps): DynamicDataTable<ResponseTableDto> => {
  return {
    singular: 'Table',
    plural: 'Tables',
    variant: DataTableVariant.COMMON,
    createAction: onCreateAction ? { label: 'Create Table', action: onCreateAction } : undefined,
    rowActions: {
      editAction: {
        label: 'Update',
        action: (row) => onEditAction?.(row),
      },
      deleteAction: {
        label: 'Delete',
        action: (row) => onDeleteAction?.(row),
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
        accessorKey: 'status',
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: (info) => {
          const value = info.getValue<string>() ?? '';
          const variant =
            value === 'available' ? 'default' : value === 'occupied' ? 'destructive' : 'outline';
          return flexRenderComponent(DataTableBadgeCell, {
            inputs: { variant, value },
          });
        },
      },
      {
        accessorFn: (row) => row.zone?.name,
        id: 'tableZone',
        header: () =>
          flexRenderComponent(TableHeadSortButton, {
            inputs: { header: 'Table Zone' },
          }),
        cell: (info) => `<div>${info.getValue<string>() ?? ''}</div>`,
      },
    ],
  };
};
