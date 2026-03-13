import { IsEnum, IsNumber } from 'class-validator';
import { CreateOrderProductDto } from './create-oder-productd.dto';
import { OrderStatus } from '../enum/order-status.enum';

export class CreateOrderDto {
  @IsNumber()
  tableId: number;

  OrderProducts: CreateOrderProductDto[];

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  total: number;
}
