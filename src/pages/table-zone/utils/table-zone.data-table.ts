import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { TableHeadSortButton } from '../../../components/datatable-builder/datatable-builder-common/sort-header-button';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';
import { ResponseTableZoneDto } from '@/types';

interface TableZoneDataTableProps {
  onCreateAction?: () => void;
  onEditAction?: (row: ResponseTableZoneDto) => void;
  onDeleteAction?: (row: ResponseTableZoneDto) => void;
}

export const getTableZoneDataTableObject = ({
  onCreateAction,
  onEditAction,
  onDeleteAction,
}: TableZoneDataTableProps): DynamicDataTable<ResponseTableZoneDto> => {
  return {
    singular: 'Table Zone',
    plural: 'Table Zones',
    variant: DataTableVariant.COMMON,
    createAction: onCreateAction
      ? { label: 'Create Table Zone', action: onCreateAction }
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
    ],
  };
};
