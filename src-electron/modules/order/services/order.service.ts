import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';

export class OrderService extends AbstractCrudService<OrderEntity> {
  constructor() {
    super(new OrderRepository());
  }
}
