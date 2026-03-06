import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../../product/entities/product.entity';
import { OrderEntity } from './order.entity';

@Entity('order_product')
export class OrderProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity)
  order: OrderEntity;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;

  @Column()
  quantity: number;
}
