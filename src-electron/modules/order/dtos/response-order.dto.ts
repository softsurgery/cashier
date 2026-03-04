import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from '../../../shared/database/dtos/database.response.dto';
import { ResponseTableDto } from '../../table/dtos/response-table.dto';
import { OrderStatus } from '../enum/order-status.enum';

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
}
