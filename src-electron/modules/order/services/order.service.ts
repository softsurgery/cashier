// src/modules/order/services/order.service.ts
import { DeepPartial } from 'typeorm';
import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { OrderProductService } from './order-product.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderStatus } from '../enum/order-status.enum';
import { TableRepository } from '../../table/repositories/table.repository';
import { TableStatus } from '../../table/enums/table-status.enum';
import { OrderProductRepository } from '../repositories/order-product.repository';
import { UpdateOrderDto } from '../dtos/update-order.dto';

export class OrderService extends AbstractCrudService<OrderEntity> {
  private readonly tableRepository = new TableRepository();
  private readonly orderProductRepository = new OrderProductRepository();

  constructor() {
    super(new OrderRepository());
  }

  private async findActiveOrderByTableId(tableId: number): Promise<OrderEntity | null> {
    return this.repository.findOne({
      where: [{ tableId, status: OrderStatus.UNPAID }, { tableId, status: OrderStatus.PARTIALLY_PAID }],
      relations: ['products', 'products.product'],
      order: { id: 'DESC' },
    });
  }

  async createFull(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    if (!createOrderDto.tableId) {
      throw new Error('tableId is required');
    }

    const orderProductService = new OrderProductService();
    const activeOrder = await this.findActiveOrderByTableId(createOrderDto.tableId);
    if (activeOrder) {
      const cartProducts = createOrderDto.products ?? [];
      await this.orderProductRepository.rawQuery('DELETE FROM order_product WHERE orderId = ?', [
        activeOrder.id,
      ]);
      if (cartProducts.length > 0) {
        await orderProductService.saveMany(
          cartProducts.map((p) => ({
            orderId: activeOrder.id,
            productId: p.productId,
            quantity: p.quantity,
          })),
        );
      }

      await this.repository.update(activeOrder.id, {
        total: Number(Number(createOrderDto.total ?? 0).toFixed(2)),
        status: OrderStatus.UNPAID,
      });
      await this.tableRepository.update(createOrderDto.tableId, { status: TableStatus.OCCUPIED });

      const refreshedOrder = await this.repository.findOne({
        where: { id: activeOrder.id },
        relations: ['products', 'products.product'],
      });
      if (!refreshedOrder) {
        throw new Error('Order not found after update');
      }
      return refreshedOrder;
    }

    const orderData: DeepPartial<OrderEntity> = {
      tableId: createOrderDto.tableId,
      status: createOrderDto.status,
      total: createOrderDto.total,
    };
    const savedOrder = await this.repository.save(orderData);

    const orderProductsData = (createOrderDto.products ?? []).map((p) => ({
      orderId: savedOrder.id,
      productId: p.productId,
      quantity: p.quantity,
    }));
    if (orderProductsData.length > 0) {
      await orderProductService.saveMany(orderProductsData);
    }
    await this.tableRepository.update(createOrderDto.tableId, { status: TableStatus.OCCUPIED });

    const fullOrder = await this.repository.findOne({
      where: { id: savedOrder.id },
      relations: ['products', 'products.product'],
    });
    if (!fullOrder) {
      throw new Error('Order not found after creation');
    }
    return fullOrder;
  }

  async pay(id: number, amount: number): Promise<OrderEntity> {
    const order = await this.repository.findOneById(id);

    if (!order) throw new Error('No order found');

    if (order.total - amount < 0) {
      throw new Error('Payment amount exceeds order total');
    }

    order.total = order.total - amount;

    if (order.total === 0) {
      order.status = OrderStatus.PAID;
      await this.orderProductRepository.rawQuery('DELETE FROM order_product WHERE orderId = ?', [id]);
      await this.tableRepository.update(order.tableId, { status: TableStatus.AVAILABLE });
    } else {
      order.status = OrderStatus.PARTIALLY_PAID;
    }

    const updatedOrder = await this.repository.save(order);
    return updatedOrder;
  }

  async update(id: number, data: UpdateOrderDto): Promise<OrderEntity | null> {
    const existingOrder = await this.repository.findOneById(id);
    if (!existingOrder) {
      throw new Error('No order found');
    }

    const nextTableId = data.tableId ?? existingOrder.tableId;
    const nextStatus = data.status ?? existingOrder.status ?? OrderStatus.UNPAID;
    const nextTotal = data.total ?? existingOrder.total;

    if (data.products) {
      await this.orderProductRepository.rawQuery('DELETE FROM order_product WHERE orderId = ?', [id]);
      if (data.products.length > 0) {
        const orderProductService = new OrderProductService();
        await orderProductService.saveMany(
          data.products.map((p) => ({
            orderId: id,
            productId: p.productId,
            quantity: p.quantity,
          })),
        );
      }
    }

    existingOrder.tableId = nextTableId;
    existingOrder.status = nextStatus;
    existingOrder.total = Number(Number(nextTotal).toFixed(2));
    await this.repository.save(existingOrder);

    await this.tableRepository.update(nextTableId, { status: TableStatus.OCCUPIED });

    return this.repository.findOne({
      where: { id },
      relations: ['products', 'products.product'],
    });
  }
}
