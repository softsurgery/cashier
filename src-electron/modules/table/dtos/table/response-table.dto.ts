import { Expose, Type } from 'class-transformer';
import { ResponseOrderDto } from '../../../order/dtos/response-order.dto';
import { ResponseDtoHelper } from '../../../../shared/database/dtos/database.response.dto';

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
