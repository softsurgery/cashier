import { DatabaseAbstractRepository } from '../../../shared/database/repositories/database.repository';
import { getDataSource } from '../../../shared/database/database';
import { ProductEntity } from '../entities/product.entity';

export class ProductRepository extends DatabaseAbstractRepository<ProductEntity> {
  constructor() {
    super(getDataSource().getRepository(ProductEntity));
  }
}
