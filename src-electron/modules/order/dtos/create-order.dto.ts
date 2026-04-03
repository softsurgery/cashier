import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CreateOrderProductDto } from './create-oder-product.dto';
import { OrderStatus } from '../enum/order-status.enum';

export class CreateOrderDto {
  @IsNumber()
  @IsOptional()
  tableId?: number;

  products: CreateOrderProductDto[];

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  total: number;
}
