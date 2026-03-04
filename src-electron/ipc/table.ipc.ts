import { ipcMain } from 'electron';
import { TableService } from '../modules/table/service/table.service';
import { TableStatus } from '../modules/table/enums/table-status.enum';

export function registerTableHandlers(): void {
  const service = new TableService();

  // Get all tables
  ipcMain.handle('table:getAll', async () => {
    return service.findAll({ order: { name: 'ASC' } });
  });

  // Get a single table by id
  ipcMain.handle('table:getById', async (_event, id: number) => {
    try {
      return await service.findOneById(id);
    } catch {
      return null;
    }
  });

  // Create a new table
  ipcMain.handle(
    'table:create',
    async (_event, data: { name: string; capacity?: number; status?: TableStatus }) => {
      return service.save(data);
    },
  );

  // Update an existing table
  ipcMain.handle(
    'table:update',
    async (
      _event,
      id: number,
      data: Partial<{ name: string; capacity: number; status: TableStatus }>,
    ) => {
      return service.update(id, data);
    },
  );

  // Delete a table
  ipcMain.handle('table:delete', async (_event, id: number) => {
    try {
      await service.delete(String(id));
      return true;
    } catch {
      return false;
    }
  });
}
