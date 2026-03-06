import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { ProductFamilyEntity } from '../entities/product-family.entity';
import { ProductFamilyRepository } from '../repositories/product-family.repository';

export class ProductFamilyService extends AbstractCrudService<ProductFamilyEntity> {
  constructor() {
    super(new ProductFamilyRepository());
  }
}
