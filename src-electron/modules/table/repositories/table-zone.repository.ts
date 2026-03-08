import { DatabaseAbstractRepository } from '../../../shared/database/repositories/database.repository';
import { getDataSource } from '../../../shared/database/database';
import { TableZoneEntity } from '../entities/table-zone.entity';

export class TableZoneRepository extends DatabaseAbstractRepository<TableZoneEntity> {
  constructor() {
    super(getDataSource().getRepository(TableZoneEntity));
  }
}
