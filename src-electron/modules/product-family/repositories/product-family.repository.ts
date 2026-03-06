import { DatabaseAbstractRepository } from '../../../shared/database/repositories/database.repository';
import { getDataSource } from '../../../shared/database/database';
import { ProductFamilyEntity } from '../entities/product-family.entity';

export class ProductFamilyRepository extends DatabaseAbstractRepository<ProductFamilyEntity> {
  constructor() {
    super(getDataSource().getRepository(ProductFamilyEntity));
  }
}
