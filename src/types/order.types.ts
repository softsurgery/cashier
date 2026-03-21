import { DatabaseEntity } from './utils/database-entity';
import { ResponseTableDto } from './table.types';
import { CreateOrderProductDto, ResponseOrderProductDto } from './order-product';
import { ResponseProductDto } from './product';

export enum OrderStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  CANCELLED = 'cancelled',
}
export interface ResponseOrderDto extends DatabaseEntity {
  id: number;
  table: ResponseTableDto;
  tableId: number;
  status: OrderStatus;
  total: number;
  products?: (ResponseOrderProductDto & { product?: ResponseProductDto })[];
  OrderProducts?: ResponseOrderProductDto[];
}

export interface CreateOrderDto {
  tableId?: number;
  products?: CreateOrderProductDto[];
  status?: OrderStatus;
  total?: number;
}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {
  status?: OrderStatus;
}
