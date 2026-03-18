// src/modules/order/services/order-product.service.ts
import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { OrderProductEntity } from '../entities/order-product.entity';
import { OrderProductRepository } from '../repositories/order-product.repository';

export class OrderProductService extends AbstractCrudService<OrderProductEntity> {
  constructor() {
    super(new OrderProductRepository());
  }
}
    