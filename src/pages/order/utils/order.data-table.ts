import {
  DataTableVariant,
  DynamicDataTable,
} from '../../../components/datatable-builder/datatable-builder.types';
import { ResponseOrderDto } from '../../../types';

interface OrderDataTableProps {}

export const getOrderDataTableObject =
  ({}: OrderDataTableProps): DynamicDataTable<ResponseOrderDto> => {
    return {
      singular: 'Order',
      plural: 'Orders',
      variant: DataTableVariant.COMMON,
      columns: [
        { label: 'ID', accessorKey: 'id' },
        { label: 'Table', accessorKey: 'tableId' },
        { label: 'Status', accessorKey: 'status' },
      ],
    };
  };
