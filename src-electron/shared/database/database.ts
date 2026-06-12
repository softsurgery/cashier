import { DataSource } from 'typeorm';
import { app } from 'electron';
import * as path from 'path';
import { TableEntity } from '../../modules/table/entities/table.entity';
import { OrderEntity } from '../../modules/order/entities/order.entity';
import { ProductFamilyEntity } from '../../modules/product-family/entities/product-family.entity';
import { ProductEntity } from '../../modules/product/entities/product.entity';
import { OrderProductEntity } from '../../modules/order/entities/order-product.entity';
import { TableZoneEntity } from '../../modules/table/entities/table-zone.entity';
import { StorageEntity } from '../storage/entities/storage.entity';
import { UserEntity } from '../../modules/user/entities/user.entity';
import { RoleEntity } from '../abstract-user-management/entities/role.entity';
import { PermissionEntity } from '../abstract-user-management/entities/permission.entity';
import { RolePermissionEntity } from '../abstract-user-management/entities/role-permission.entity';
import { AbstractUserEntity } from '../abstract-user-management/entities/abstract-user.entity';
import { NotificationEntity } from '../notifications/entities/notification.entity';
import { LogEntity } from '../logger/entities/log.entity';

let dataSource: DataSource | null = null;

export async function initializeDatabase(): Promise<DataSource> {
  if (dataSource?.isInitialized) {
    return dataSource;
  }

  const dbPath = path.join(app.getPath('userData'), 'cashier.db');

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [
      StorageEntity,
      TableZoneEntity,
      TableEntity,
      OrderEntity,
      ProductFamilyEntity,
      ProductEntity,
      OrderProductEntity,
      AbstractUserEntity,
      UserEntity,
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
      NotificationEntity,
      LogEntity,
    ],
    synchronize: true,
    // logging: !app.isPackaged,
    logging: false,
  });

  await dataSource.initialize();
  console.log(`[Database] Initialized at: ${dbPath}`);

  return dataSource;
}

export function getDataSource(): DataSource {
  if (!dataSource?.isInitialized) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dataSource;
}
