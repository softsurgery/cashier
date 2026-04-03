import { ipcMain } from 'electron';
import { FindManyOptions } from 'typeorm';
import { CreateOrderProductDto } from '@/modules/order/dtos/create-oder-product.dto';
import { UpdateOrderProductDto } from '@/modules/order/dtos/update-oder-productd.dto';
import { OrderProductEntity } from '@/modules/order/entities/order-product.entity';
import { OrderProductService } from '@/modules/order/services/order-product.service';

export function registerOrderProductHandlers(): void {
  const service = new OrderProductService();

  // Get all orders
  ipcMain.handle('order:findAll', async (_event, query: FindManyOptions<OrderProductEntity>) => {
    return service.findAll(query);
  });

  // Get a single order by id
  ipcMain.handle('order:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  // Create a new order for a order
  ipcMain.handle('order:create', async (_event, data: CreateOrderProductDto) => {
    return service.save(data);
  });

  // Update an existing order
  ipcMain.handle('order:update', async (_event, id: number, data: UpdateOrderProductDto) => {
    return service.update(id, data);
  });

  // Delete a order
  ipcMain.handle('order:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
