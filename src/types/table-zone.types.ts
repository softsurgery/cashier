import { DatabaseEntity } from './utils/database-entity';
import { ResponseTableDto } from './table.types';

export interface ResponseTableZoneDto extends DatabaseEntity {
  id: number;
  name: string;
  tables: ResponseTableDto[];
}
