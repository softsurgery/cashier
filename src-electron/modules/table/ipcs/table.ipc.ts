import { ipcMain } from 'electron';
import { TableService } from '../service/table.service';
import type { FindManyQueryDto } from '../../../../src/types/find-many-query.types';
import { CreateTableDto } from '../dtos/table/create-table.dto';
import { UpdateTableDto } from '../dtos/table/update-table.dto';

export function registerTableHandlers(): void {
  const service = new TableService();

  ipcMain.handle('table:findAll', async (_event, query: FindManyQueryDto) => {
    return service.findAll(query);
  });

  ipcMain.handle('table:findAllPaginated', async (_event, query: FindManyQueryDto) => {
    return service.findAllPaginated(query);
  });

  // Get a single table by id
  ipcMain.handle('table:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  // Create a new table
  ipcMain.handle('table:create', async (_event, data: CreateTableDto) => {
    return service.save(data);
  });

  // Update an existing table
  ipcMain.handle('table:update', async (_event, id: number, data: UpdateTableDto) => {
    return service.update(id, data);
  });

  // Delete a table
  ipcMain.handle('table:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
