import { DatabaseAbstractRepository } from '../../../shared/database/repositories/database.repository';
import { TableEntity } from '../entities/table.entity';
import { getDataSource } from '../../../shared/database/database';

export class TableRepository extends DatabaseAbstractRepository<TableEntity> {
  constructor() {
    super(getDataSource().getRepository(TableEntity));
  }
}
