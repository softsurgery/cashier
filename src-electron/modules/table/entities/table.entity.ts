import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EntityHelper } from '../../../shared/database/entities/entity-helper';
import { OrderEntity } from '../../order/entities/order.entity';
import { TableStatus } from '../enums/table-status.enum';
import { TableZoneEntity } from './table-zone.entity';

@Entity('tables')
export class TableEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;

  @OneToMany(() => OrderEntity, (order) => order.table)
  orders: OrderEntity[];

  @OneToMany(() => TableZoneEntity, (zone) => zone.tables)
  zone: TableZoneEntity;
}
