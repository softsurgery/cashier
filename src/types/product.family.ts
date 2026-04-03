import { ResponseProductDto } from './product';
import { ResponseStorageDto } from './storage';
import { DatabaseEntity } from './utils/database-entity';

export interface ResponseProductFamilyDto extends DatabaseEntity {
  id: number;
  name: string;
  description: string;
  products: ResponseProductDto[];
  pictureId: number | null;
  picture?: ResponseStorageDto;
}

export interface CreateProductFamilyDto {
  name: string;
  description: string;
  pictureId?: number | null;
}

export interface UpdateProductFamilyDto extends Partial<CreateProductFamilyDto> {}
