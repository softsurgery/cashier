import { ResponseOrderDto } from './order.types';
import { ResponseTableZoneDto } from './table-zone.types';
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
  zoneId?: number;
  zone?: ResponseTableZoneDto;
}

export interface CreateTableDto {
  name: string;
  status?: TableStatus;
  zoneId: number;
}

export interface UpdateTableDto extends Partial<CreateTableDto> {}
