import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseTableDto } from '../../../types';
import { TableHeadSortButton } from '../../../components/datatable-builder/datatable-builder-common/sort-header-button';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';

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
        accessorKey: 'status',
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: (info) => `<div class="capitalize">${info.getValue<string>() ?? ''}</div>`,
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
