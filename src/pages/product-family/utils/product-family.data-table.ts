import { flexRenderComponent } from '@tanstack/angular-table';
import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseProductFamilyDto } from '../../../types';
import { TableHeadSortButton } from '../../../components/datatable-builder/datatable-builder-common/sort-header-button';
import { DatatableBuilderActionDropdownComponent } from '../../../components/datatable-builder/core/datatable-builder-action-dropdown/datatable-builder-action-dropdown.component';
import { checkboxColumnDef } from '../../../components/datatable-builder/utils/datatable-builder-select';

interface ProductFamilyDataTableProps {}

export const getProductFamilyDataTableObject =
  ({}: ProductFamilyDataTableProps): DynamicDataTable<ResponseProductFamilyDto> => {
    return {
      singular: 'Product Family',
      plural: 'Product Families',
      variant: DataTableVariant.COMMON,
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
          cell: (info) => `<div class="text-muted">${info.getValue<string>() ?? ''}</div>`,
        },
        {
          id: 'actions',
          enableHiding: false,
          cell: () => flexRenderComponent(DatatableBuilderActionDropdownComponent),
        },
      ],
    };
  };
