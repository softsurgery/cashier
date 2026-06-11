import { ipcMain } from 'electron';
import type { FindManyQueryDto } from '../../../../src/types/find-many-query.types';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UpdateOrderDto } from '../dtos/update-order.dto';

export function registerOrderHandlers(): void {
  const service = new OrderService();

  ipcMain.handle('order:findAll', async (_event, query: FindManyQueryDto) => {
    return service.findAll(query);
  });

  ipcMain.handle('order:findAllPaginated', async (_event, query: FindManyQueryDto) => {
    return service.findAllPaginated(query);
  });

  ipcMain.handle('order:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  ipcMain.handle('order:create', async (_event, data: CreateOrderDto) => {
    return service.createFull(data);
  });

  ipcMain.handle('order:pay', async (_event, id: number, amount: number) => {
    return service.pay(id, amount);
  });

  ipcMain.handle('order:update', async (_event, id: number, data: UpdateOrderDto) => {
    return service.update(id, data);
  });

  ipcMain.handle('order:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
