import { Expose, Type } from 'class-transformer';
import { DatabaseEntity } from './utils/database-entity';
import { ResponseTableDto } from './table.types';

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
}

export interface CreateOrderDto {
  tableId?: number;
}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {
  status?: OrderStatus;
}
