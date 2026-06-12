import { ipcMain } from 'electron';
import { TableZoneService } from '../service/table-zone.service';
import type { FindManyQueryDto } from '@/types/find-many-query.types';
import { CreateTableZoneDto } from '../dtos/table-zone/create-table-zone.dto';
import { UpdateTableZoneDto } from '../dtos/table-zone/update-table-zone.dto';

export function registerTableZoneHandlers(): void {
  const service = new TableZoneService();

  ipcMain.handle('table-zone:findAll', async (_event, query: FindManyQueryDto) => {
    return service.findAll(query);
  });

  ipcMain.handle('table-zone:findAllPaginated', async (_event, query: FindManyQueryDto) => {
    return service.findAllPaginated(query);
  });

  // Get a single table zone by id
  ipcMain.handle('table-zone:findOneById', async (_event, id: number) => {
    return service.findOneById(id);
  });

  // Create a new table zone
  ipcMain.handle('table-zone:create', async (_event, data: CreateTableZoneDto) => {
    return service.save(data);
  });

  // Update an existing table zone
  ipcMain.handle('table-zone:update', async (_event, id: number, data: UpdateTableZoneDto) => {
    return service.update(id, data);
  });

  // Delete a table zone
  ipcMain.handle('table-zone:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
