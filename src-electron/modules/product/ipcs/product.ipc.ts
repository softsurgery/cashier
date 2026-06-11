import { ipcMain } from 'electron';
import { FindManyOptions } from 'typeorm';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

export function registerProductHandlers(): void {
  const service = new ProductService();
  ipcMain.handle('product:findAll', async (_event, query: FindManyOptions) => {
    return service.findAll(query);
  });

  ipcMain.handle('product:findAllPaginated', async (_event, query: FindManyOptions) => {
    return service.findAllPaginated(query);
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
