import { DeepPartial } from 'typeorm';
import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { OrderEntity } from '../entities/order.entity';
import { OrderRepository } from '../repositories/order.repository';
import { OrderProductService } from './order-product.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderStatus } from '../enum/order-status.enum';
import { TableRepository } from '../../table/repositories/table.repository';
import { TableStatus } from '../../table/enums/table-status.enum';
import { UpdateOrderDto } from '../dtos/update-order.dto';

export class OrderService extends AbstractCrudService<OrderEntity> {
  private readonly tableRepository = new TableRepository();
  private readonly orderProductService = new OrderProductService();

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

  private async replaceOrderProducts(
    orderId: number,
    products: { productId: number; quantity: number }[],
  ): Promise<void> {
    const existing = await this.orderProductService.findAll({ where: { orderId } as any });
    await Promise.all(existing.map((p) => this.orderProductService.delete(String(p.id))));

    if (products.length) {
      await this.orderProductService.saveMany(
        products.map((p) => ({ orderId, productId: p.productId, quantity: p.quantity })),
      );
    }
  }

  async createFull(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const tableId = createOrderDto.tableId ?? undefined;

    const orderData: DeepPartial<OrderEntity> = {
      tableId,
      status: createOrderDto.status ?? OrderStatus.UNPAID,
      total: createOrderDto.total,
      paidAmount: 0,
    };
    const savedOrder = await this.repository.save(orderData);

    if (createOrderDto.products?.length) {
      await this.orderProductService.saveMany(
        createOrderDto.products.map((p) => ({
          orderId: savedOrder.id,
          productId: p.productId,
          quantity: p.quantity,
        })),
      );
    }

    if (tableId !== undefined) {
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
    if (existingOrder.status == 'paid') throw new Error('Cannot Mutate a Paid Order');

    if (data.products) {
      await this.replaceOrderProducts(id, data.products);
    }

    const paidAmount = Number(existingOrder.paidAmount ?? 0);
    const newTotal = Number(data.total ?? existingOrder.total);

    if (paidAmount >= newTotal) throw new Error('Mutation not Possible at this state');

    existingOrder.total = newTotal;
    existingOrder.paidAmount = paidAmount;
    await this.repository.save(existingOrder);

    if (existingOrder.tableId !== undefined) {
      await this.tableRepository.update(existingOrder.tableId, { status: TableStatus.OCCUPIED });
    }

    return this.repository.findOne({
      where: { id },
      relations: ['products', 'products.product'],
    });
  }
}
