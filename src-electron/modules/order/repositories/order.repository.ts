import { DatabaseAbstractRepository } from '../../../shared/database/repositories/database.repository';
import { getDataSource } from '../../../shared/database/database';
import { OrderEntity } from '../entities/order.entity';

export class OrderRepository extends DatabaseAbstractRepository<OrderEntity> {
  constructor() {
    super(getDataSource().getRepository(OrderEntity));
  }
}
