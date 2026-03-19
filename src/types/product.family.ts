import { ResponseProductDto } from './product';
import { DatabaseEntity } from './utils/database-entity';

export interface ResponseProductFamilyDto extends DatabaseEntity {
  id: number;
  name: string;
  description: string;
  products: ResponseProductDto[];
}

export interface CreateProductFamilyDto {
  name: string;
  description: string;
}

export interface UpdateProductFamilyDto extends Partial<CreateProductFamilyDto> {}
