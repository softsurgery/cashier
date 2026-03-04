import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from '../../../shared/database/dtos/database.response.dto';
import { ResponseOrderDto } from '../../order/dtos/response-order.dto';

export class ResponseTableDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => ResponseOrderDto)
  orders: ResponseOrderDto[];
}
