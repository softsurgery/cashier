import { ipcMain } from 'electron';
import { FindManyOptions } from 'typeorm';
import { CreateProductFamilyDto } from '../modules/product-family/dtos/create-product-family.dto';
import { UpdateProductFamilyDto } from '../modules/product-family/dtos/update-product-family.dto';
import { ProductService } from '../modules/product/services/product.service';

export function registerProductHandlers(): void {
  const service = new ProductService();
  // Get all products
  ipcMain.handle('product:findAll', async (_event, query: FindManyOptions) => {
    return service.findAll(query);
  });

  // Get a single product by id
  ipcMain.handle('product:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  // Create a new product for a product
  ipcMain.handle('product:create', async (_event, data: CreateProductFamilyDto) => {
    return service.save(data);
  });

  // Update an existing product
  ipcMain.handle('product:update', async (_event, id: number, data: UpdateProductFamilyDto) => {
    return service.update(id, data);
  });

  // Delete a product
  ipcMain.handle('product:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
