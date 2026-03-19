import { DatabaseAbstractRepository } from '../../../shared/database/repositories/database.repository';
import { getDataSource } from '../../../shared/database/database';
import { OrderProductEntity } from '../entities/order-product.entity';

export class OrderProductRepository extends DatabaseAbstractRepository<OrderProductEntity> {
  constructor() {
    super(getDataSource().getRepository(OrderProductEntity));
  }
}
