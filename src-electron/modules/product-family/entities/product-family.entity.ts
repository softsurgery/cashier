import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { EntityHelper } from '../../../shared/database/entities/entity-helper';
import { ProductEntity } from '@/modules/product/entities/product.entity';
import { StorageEntity } from '@/shared/storage/entities/storage.entity';

@Entity('product-family')
export class ProductFamilyEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  name!: string;

  @Column({ type: 'varchar', length: 200 })
  description!: string;

  @OneToMany(() => ProductEntity, (product) => product.productFamily)
  products: ProductEntity[];

  @Column({ type: 'int', nullable: true })
  pictureId: number;

  @ManyToOne(() => StorageEntity)
  @JoinColumn({ name: 'pictureId' })
  picture: StorageEntity;
}
