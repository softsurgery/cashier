import { IsNumber } from 'class-validator';

export class CreateOrderProductDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

}
