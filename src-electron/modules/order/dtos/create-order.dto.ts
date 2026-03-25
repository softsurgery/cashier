import { IsEnum, IsNumber } from 'class-validator';
import { CreateOrderProductDto } from './create-oder-product.dto';
import { OrderStatus } from '../enum/order-status.enum';

export class CreateOrderDto {
  @IsNumber()
  tableId?: number;

  products: CreateOrderProductDto[];

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  total: number;
}
