import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { EntityHelper } from '../../../shared/database/entities/entity-helper';
import { TableEntity } from '../../table/entities/table.entity';
import { OrderStatus } from '../enum/order-status.enum';
import { OrderProductEntity } from './order-product.entity';

@Entity('orders')
export class OrderEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TableEntity, (table) => table.orders)
  table?: TableEntity;

  @Column()
  tableId: number;

  @Column({ enum: OrderStatus, default: OrderStatus.UNPAID })
  status?: OrderStatus;

  @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order, { cascade: true })
  products: OrderProductEntity[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total: number;
}
