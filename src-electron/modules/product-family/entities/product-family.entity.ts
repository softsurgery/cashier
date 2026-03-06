import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EntityHelper } from '../../../shared/database/entities/entity-helper';

@Entity('product-family')
export class ProductFamilyEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 200 })
  description!: string;
}
