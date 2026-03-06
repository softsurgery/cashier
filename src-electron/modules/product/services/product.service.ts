import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { ProductEntity } from '../entities/product.entity';
import { ProductRepository } from '../repositories/product.repository';

export class ProductService extends AbstractCrudService<ProductEntity> {
  constructor() {
    super(new ProductRepository());
  }
}
