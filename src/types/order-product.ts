import { DatabaseEntity } from './utils/database-entity';

// Order Product Interfaces
export interface ResponseOrderProductDto extends DatabaseEntity {
  id: number;
  productId: number;
  quantity: number;
  orderId: number;
}

export interface CreateOrderProductDto {
  orderId: number;
  productId: number;
  quantity: number;
}

export interface UpdateOrderProductDto extends CreateOrderProductDto {}
