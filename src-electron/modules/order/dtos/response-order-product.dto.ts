import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from '@/shared/database/dtos/database.response.dto';

export class ResponseOrderProductDto extends ResponseDtoHelper {
  @Expose()
  id: number;

  @Expose()
  productId: number;

  @Expose()
  quantity: number;

  @Expose()
  orderId: number;
}
