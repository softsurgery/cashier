import { ipcMain } from 'electron';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ProductFamilyService } from '../modules/product-family/services/product-family.service';
import { CreateProductFamilyDto } from '../modules/product-family/dtos/create-product-family.dto';
import { UpdateProductFamilyDto } from '../modules/product-family/dtos/update-product-family.dto';
import { ProductFamilyEntity } from '@/modules/product-family/entities/product-family.entity';

export function registerProductFamilyHandlers(): void {
  const service = new ProductFamilyService();
  // Get all product-families
  ipcMain.handle('product-family:findAll', async (_event, query: FindManyOptions) => {
    return service.findAll(query);
  });

  // Get a single product-family by id
  ipcMain.handle(
    'product-family:findOneById',
    async (_event, id: number, query?: Pick<FindOneOptions<ProductFamilyEntity>, 'join'>) => {
      return service.findOneById(id, query);
    },
  );

  // Create a new product-family for a product-family
  ipcMain.handle('product-family:create', async (_event, data: CreateProductFamilyDto) => {
    return service.save(data);
  });

  // Update an existing product-family
  ipcMain.handle(
    'product-family:update',
    async (_event, id: number, data: UpdateProductFamilyDto) => {
      return service.update(id, data);
    },
  );

  // Delete a product-family
  ipcMain.handle('product-family:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
