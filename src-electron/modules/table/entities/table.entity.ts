import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityHelper } from '../../../shared/database/entities/entity-helper';

export enum TableStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
}

@Entity('tables')
export class TableEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', default: TableStatus.AVAILABLE })
  status!: TableStatus;
}
