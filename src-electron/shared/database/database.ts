import { DataSource } from 'typeorm';
import { app } from 'electron';
import * as path from 'path';
import { TableEntity } from '../../modules/table/entities/table.entity';
import { OrderEntity } from '../../modules/order/entities/order.entity';

let dataSource: DataSource | null = null;

export async function initializeDatabase(): Promise<DataSource> {
  if (dataSource?.isInitialized) {
    return dataSource;
  }

  const dbPath = path.join(app.getPath('userData'), 'cashier.db');

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    entities: [TableEntity, OrderEntity],
    synchronize: true,
    logging: !app.isPackaged,
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
