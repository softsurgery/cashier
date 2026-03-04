import { ResponseOrderDto } from './order.types';
import { DatabaseEntity } from './utils/database-entity';

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
}

export interface ResponseTableDto extends DatabaseEntity {
  id: number;
  name: string;
  status: TableStatus;
  orders: ResponseOrderDto[];
}

export interface CreateTableDto {
  name: string;
  status?: TableStatus;
}
