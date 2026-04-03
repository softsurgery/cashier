import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationType } from '../../../app/enums/notification-type.enum';
import { EntityHelper } from '@/shared/database/entities/entity-helper';
import { AbstractUserEntity } from '@/shared/abstract-user-management/entities/abstract-user.entity';

@Entity('notification')
export class NotificationEntity extends EntityHelper {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: NotificationType, nullable: true })
  type: NotificationType;

  @ManyToOne(() => AbstractUserEntity, (user) => user.notifications, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: AbstractUserEntity;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: 'json', nullable: true })
  payload?: object;
}
