import { ipcMain } from 'electron';
import { TableZoneService } from '../modules/table/service/table-zone.service';
import { FindManyOptions } from 'typeorm';
import { CreateTableZoneDto } from '../modules/table/dtos/table-zone/create-table-zone.dto';
import { UpdatetableZoneDto } from '../modules/table/dtos/table-zone/update-table-zone.dto';

export function registerTableZoneHandlers(): void {
  const service = new TableZoneService();

  // Get all table zones
  ipcMain.handle('table-zone:findAll', async (_event, query: FindManyOptions) => {
    return service.findAll(query);
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
  ipcMain.handle('table-zone:update', async (_event, id: number, data: UpdatetableZoneDto) => {
    return service.update(id, data);
  });

  // Delete a table zone
  ipcMain.handle('table-zone:delete', async (_event, id: number) => {
    return service.softDelete(String(id));
  });
}
