import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHelper } from '../../../shared/database/entities/entity-helper';
import { TableEntity } from './table.entity';

@Entity('table-zones')
export class TableZoneEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => TableEntity, (table) => table.zone)
  tables: TableEntity[];
}
