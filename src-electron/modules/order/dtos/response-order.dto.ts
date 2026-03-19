import { Expose, Type } from 'class-transformer';
import { ResponseTableDto } from '@/modules/table/dtos/table/response-table.dto';
import { OrderStatus } from '../enum/order-status.enum';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';

export class ResponseOrderDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ResponseTableDto)
  table: ResponseTableDto;

  @Expose()
  tableId: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  total: number;
}
