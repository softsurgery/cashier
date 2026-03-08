import { ipcMain } from 'electron';
import { TableStatus } from '../modules/table/enums/table-status.enum';
import { TableZoneService } from '../modules/table/service/table-zone.service';

export function registerTableZoneHandlers(): void {
  const service = new TableZoneService();

  // Get all table zones
  ipcMain.handle('table-zone:getAll', async () => {
    return service.findAll({ order: { name: 'ASC' } });
  });

  // Get a single table zone by id
  ipcMain.handle('table-zone:getById', async (_event, id: number) => {
    try {
      return await service.findOneById(id);
    } catch {
      return null;
    }
  });

  // Create a new table zone
  ipcMain.handle(
    'table-zone:create',
    async (_event, data: { name: string; capacity?: number; status?: TableStatus }) => {
      return service.save(data);
    },
  );

  // Update an existing table zone
  ipcMain.handle(
    'table-zone:update',
    async (
      _event,
      id: number,
      data: Partial<{ name: string; capacity: number; status: TableStatus }>,
    ) => {
      return service.update(id, data);
    },
  );

  // Delete a table zone
  ipcMain.handle('table-zone:delete', async (_event, id: number) => {
    try {
      await service.delete(String(id));
      return true;
    } catch {
      return false;
    }
  });
}
