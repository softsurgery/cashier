import { ResponseProductFamilyDto } from './product.family';
import { DatabaseEntity } from './utils/database-entity';

export interface ResponseProductDto extends DatabaseEntity {
  id: number;
  name: string;
  description: string;
  price: number;
  productFamily: ResponseProductFamilyDto;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  productFamilyId: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
