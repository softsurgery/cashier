import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractUserEntity } from './abstract-user.entity';
import { RolePermissionEntity } from './role-permission.entity';
import { EntityHelper } from '@/shared/database/entities/entity-helper';

@Entity('roles')
export class RoleEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  label: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => RolePermissionEntity, (rolePermission) => rolePermission.role)
  permissions: RolePermissionEntity[];

  @OneToMany(() => AbstractUserEntity, (user) => user.role)
  users: AbstractUserEntity[];
}
