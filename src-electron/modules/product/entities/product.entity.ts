import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from 'typeorm';
import { EntityHelper } from '../../../shared/database/entities/entity-helper';
import { ProductFamilyEntity } from '../../product-family/entities/product-family.entity';
@Entity('product')
export class ProductEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 200 })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => ProductFamilyEntity)
  @JoinColumn({ name: 'productFamilyId' })
  productFamily: ProductFamilyEntity;

  @Column({ type: 'number' })
  productFamilyId!: number;
}
