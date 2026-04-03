import { ipcMain } from 'electron';
import { FindManyOptions } from 'typeorm';

import { ProductService } from '../modules/product/services/product.service';
import { CreateProductDto } from '../modules/product/dtos/create-product.dto';
import { UpdateProductDto } from '../modules/product/dtos/update-product.dto';

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
  ipcMain.handle('product:create', async (_event, data: CreateProductDto) => {
    return service.save(data);
  });

  // Update an existing product
  ipcMain.handle('product:update', async (_event, id: number, data: UpdateProductDto) => {
    return service.update(id, data);
  });

  // Delete a product
  ipcMain.handle('product:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
