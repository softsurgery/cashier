import { ipcMain } from 'electron';
import type { FindManyQueryDto } from '@/types/find-many-query.types';
import { CreateOrderProductDto } from '@/modules/order/dtos/create-order-product.dto';
import { UpdateOrderProductDto } from '@/modules/order/dtos/update-order-product.dto';
import { OrderProductEntity } from '@/modules/order/entities/order-product.entity';
import { OrderProductService } from '@/modules/order/services/order-product.service';

export function registerOrderProductHandlers(): void {
  const service = new OrderProductService();

  // Get all orders
  ipcMain.handle(
    'order-product:findAll',
    async (_event, query: FindManyQueryDto) => {
      return service.findAll(query);
    },
  );

  // Get a single order by id
  ipcMain.handle('order-product:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  // Create a new order for a order
  ipcMain.handle('order-product:create', async (_event, data: CreateOrderProductDto) => {
    return service.save(data);
  });

  // Update an existing order
  ipcMain.handle(
    'order-product:update',
    async (_event, id: number, data: UpdateOrderProductDto) => {
      return service.update(id, data);
    },
  );

  // Delete a order
  ipcMain.handle('order-product:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
