import { DeepPartial, FindManyOptions } from 'typeorm';
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
      where: [
        { tableId, status: OrderStatus.UNPAID },
        { tableId, status: OrderStatus.PARTIALLY_PAID },
      ],
      relations: ['products', 'products.product'],
      order: { id: 'DESC' },
    });
  }

  async createFull(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const tableId = createOrderDto.tableId ?? undefined; // undefined means no table
    const isTableOrder = tableId !== undefined;

    // For table orders: try to update existing active order
    if (isTableOrder) {
      const activeOrder = await this.findActiveOrderByTableId(tableId);
      if (activeOrder) {
        // Replace products
        await this.orderProductRepository.rawQuery('DELETE FROM order_product WHERE orderId = ?', [
          activeOrder.id,
        ]);
        if (createOrderDto.products?.length) {
          const orderProductService = new OrderProductService();
          await orderProductService.saveMany(
            createOrderDto.products.map((p) => ({
              orderId: activeOrder.id,
              productId: p.productId,
              quantity: p.quantity,
            })),
          );
        }

        // Recalculate totals and status
        const paidAmount = Number(activeOrder.paidAmount ?? 0);
        const newTotal = Number(createOrderDto.total ?? 0);
        const remainingTotal = Math.max(0, newTotal - paidAmount);
        const status =
          remainingTotal === 0
            ? OrderStatus.PAID
            : paidAmount > 0
              ? OrderStatus.PARTIALLY_PAID
              : OrderStatus.UNPAID;

        await this.repository.update(activeOrder.id, {
          total: remainingTotal,
          paidAmount,
          status,
        });
        await this.tableRepository.update(tableId, { status: TableStatus.OCCUPIED });

        const refreshedOrder = await this.repository.findOne({
          where: { id: activeOrder.id },
          relations: ['products', 'products.product'],
        });
        if (!refreshedOrder) throw new Error('Order not found after update');
        return refreshedOrder;
      }
    }

    // Create new order (for no-table orders or when no active order exists)
    const orderData: DeepPartial<OrderEntity> = {
      tableId, // undefined allowed
      status: createOrderDto.status ?? OrderStatus.UNPAID,
      total: createOrderDto.total,
      paidAmount: 0,
    };
    const savedOrder = await this.repository.save(orderData);

    if (createOrderDto.products?.length) {
      const orderProductService = new OrderProductService();
      await orderProductService.saveMany(
        createOrderDto.products.map((p) => ({
          orderId: savedOrder.id,
          productId: p.productId,
          quantity: p.quantity,
        })),
      );
    }

    if (isTableOrder) {
      await this.tableRepository.update(tableId, { status: TableStatus.OCCUPIED });
    }

    const fullOrder = await this.repository.findOne({
      where: { id: savedOrder.id },
      relations: ['products', 'products.product'],
    });
    if (!fullOrder) throw new Error('Order not found after creation');
    return fullOrder;
  }

  async pay(id: number, amount: number): Promise<OrderEntity> {
    const order = await this.repository.findOneById(id);
    if (!order) throw new Error('No order found');
    if (order.total - amount < 0) throw new Error('Payment amount exceeds order total');

    order.paidAmount = Number((Number(order.paidAmount ?? 0) + amount).toFixed(2));

    if (order.total === order.paidAmount) {
      order.status = OrderStatus.PAID;
      if (order.tableId !== undefined) {
        await this.tableRepository.update(order.tableId, { status: TableStatus.AVAILABLE });
      }
    } else {
      order.status = OrderStatus.PARTIALLY_PAID;
    }

    return this.repository.save(order);
  }

  async update(id: number, data: UpdateOrderDto): Promise<OrderEntity | null> {
    const existingOrder = await this.repository.findOneById(id);
    if (!existingOrder) throw new Error('No order found');

    // Update products if provided (replace all)
    if (data.products) {
      await this.orderProductRepository.rawQuery('DELETE FROM order_product WHERE orderId = ?', [
        id,
      ]);
      if (data.products.length) {
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

    // Update order fields
    const paidAmount = Number(existingOrder.paidAmount ?? 0);
    const newTotal = Number(data.total ?? existingOrder.total);
    const status =
      data.status ??
      (newTotal === 0
        ? OrderStatus.PAID
        : paidAmount > 0
          ? OrderStatus.PARTIALLY_PAID
          : OrderStatus.UNPAID);
    const newTableId =
      data.tableId !== undefined
        ? data.tableId === 0
          ? undefined
          : data.tableId
        : existingOrder.tableId;

    existingOrder.tableId = newTableId;
    existingOrder.status = status;
    existingOrder.total = newTotal;
    existingOrder.paidAmount = paidAmount;
    await this.repository.save(existingOrder);

    // Update table status if this is a table order
    if (existingOrder.tableId !== undefined) {
      await this.tableRepository.update(existingOrder.tableId, { status: TableStatus.OCCUPIED });
    }

    return this.repository.findOne({
      where: { id },
      relations: ['products', 'products.product'],
    });
  }
}
