import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { TableZoneEntity } from '../entities/table-zone.entity';
import { TableZoneRepository } from '../repositories/table-zone.repository';

export class TableZoneService extends AbstractCrudService<TableZoneEntity> {
  constructor() {
    super(new TableZoneRepository());
  }
}
