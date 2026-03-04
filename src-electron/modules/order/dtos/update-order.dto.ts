import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../enum/order-status.enum';
import { CreateOrderDto } from './create-order.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
