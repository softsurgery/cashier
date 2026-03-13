// order.handler.ts
import { ipcMain } from 'electron';
import { OrderService } from '../modules/order/services/order.service';
import { OrderProductService } from '../modules/order/services/order-product.service';
import { FindManyOptions } from 'typeorm';
import { OrderEntity } from '../modules/order/entities/order.entity';
import { OrderProductEntity } from '../modules/order/entities/order-product.entity';
import { CreateOrderDto } from '../modules/order/dtos/create-order.dto';
import { UpdateOrderDto } from '../modules/order/dtos/update-order.dto';
import { getDataSource } from '../shared/database/database';

export function registerOrderHandlers(): void {
  const service = new OrderService();

  ipcMain.handle('order:findAll', async (_event, query: FindManyOptions<OrderEntity>) => {
    return service.findAll(query);
  });

  ipcMain.handle('order:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  ipcMain.handle('order:create', async (_event, data: CreateOrderDto) => {
    const dataSource = getDataSource();

    return dataSource.transaction(async (manager) => {
      try {
        const orderRepo = manager.getRepository(OrderEntity);
        const orderProductRepo = manager.getRepository(OrderProductEntity);
        const order = orderRepo.create({
          tableId: data.tableId,
          status: data.status,
          total: data.total,
        });

        const savedOrder = await orderRepo.save(order);
        const orderProducts = data.products.map((p) => {
          const op = orderProductRepo.create({
            orderId: savedOrder.id,
            productId: p.productId,
            quantity: p.quantity,
          });
          return op;
        });

        const savedProducts = await orderProductRepo.save(orderProducts);
        const fullOrder = await orderRepo.findOne({
          where: { id: savedOrder.id },
          relations: ['products', 'products.product'],
        });
        return fullOrder;
      } catch (err) {
        throw err;
      }
    });
  });

  // ipcMain.handle('order:update', async (_event, id: number, data: UpdateOrderDto) => {
  //   return service.update(id, data);
  // });

  ipcMain.handle('order:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
