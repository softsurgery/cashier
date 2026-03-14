// order.handler.ts
import { ipcMain } from 'electron';
import { OrderService } from '../modules/order/services/order.service';
import { FindManyOptions } from 'typeorm';
import { OrderEntity } from '../modules/order/entities/order.entity';
import { CreateOrderDto } from '../modules/order/dtos/create-order.dto';
import { UpdateOrderDto } from '../modules/order/dtos/update-order.dto';

export function registerOrderHandlers(): void {
  const service = new OrderService();

  ipcMain.handle('order:findAll', async (_event, query: FindManyOptions<OrderEntity>) => {
    return service.findAll(query);
  });

  ipcMain.handle('order:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  ipcMain.handle('order:create', async (_event, data: CreateOrderDto) => {
    return service.createFull(data);
  });

  // ipcMain.handle('order:update', async (_event, id: number, data: UpdateOrderDto) => {
  //   return service.update(id, data);
  // });

  ipcMain.handle('order:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
