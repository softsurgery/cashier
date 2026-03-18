// src/modules/order/services/order.service.ts
import { DeepPartial } from 'typeorm';
import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { OrderProductService } from './order-product.service';
import { CreateOrderDto } from '../dtos/create-order.dto';

export class OrderService extends AbstractCrudService<OrderEntity> {
  constructor() {
    super(new OrderRepository());
  }

  async createFull(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const orderData: DeepPartial<OrderEntity> = {
      tableId: createOrderDto.tableId,
      status: createOrderDto.status,
      total: createOrderDto.total,
    };
    const savedOrder = await this.repository.save(orderData);

    const orderProductService = new OrderProductService();
    const orderProductsData = createOrderDto.products.map((p) => ({
      orderId: savedOrder.id,
      productId: p.productId,
      quantity: p.quantity,
    }));
    await orderProductService.saveMany(orderProductsData);

    const fullOrder = await this.repository.findOne({
      where: { id: savedOrder.id },
      relations: ['products', 'products.product'],
    });
    if (!fullOrder) {
      throw new Error('Order not found after creation');
    }
    return fullOrder;
  }
}
