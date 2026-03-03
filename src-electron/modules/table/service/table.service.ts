import { AbstractCrudService } from '../../../shared/database/services/abstract-crud.service';
import { TableEntity } from '../entities/table.entity';
import { TableRepository } from '../repositories/table.repository';

export class TableService extends AbstractCrudService<TableEntity> {
  constructor() {
    super(new TableRepository());
  }
}
