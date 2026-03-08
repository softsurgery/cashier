import { Location } from './models/location.model';
import { Table } from './models/table.model';

export const mockLocations: Location[] = [
  { id: 'loc-1', name: 'A/C' },
  { id: 'loc-2', name: 'Non A/C' },
  { id: 'loc-3', name: 'Bar' },
];

export const mockTables: Table[] = [
  // A/C
  { id: 't-1', number: '1', locationId: 'loc-1', status: 'blank', capacity: 4 },
  { id: 't-2', number: '2', locationId: 'loc-1', status: 'running', capacity: 4 },
  { id: 't-3', number: '3', locationId: 'loc-1', status: 'blank', capacity: 4 },
  { id: 't-4', number: '4', locationId: 'loc-1', status: 'blank', capacity: 4 },
  { id: 't-5', number: '5', locationId: 'loc-1', status: 'running', capacity: 4 },
  { id: 't-6', number: '6', locationId: 'loc-1', status: 'blank', capacity: 4 },
  { id: 't-7', number: '7', locationId: 'loc-1', status: 'blank', capacity: 4 },
  { id: 't-8', number: '8', locationId: 'loc-1', status: 'reserved', capacity: 4 },
  { id: 't-9', number: '9', locationId: 'loc-1', status: 'blank', capacity: 4 },
  { id: 't-10', number: '10', locationId: 'loc-1', status: 'blank', capacity: 4 },
  { id: 't-11', number: '11', locationId: 'loc-1', status: 'blank', capacity: 4 },
  { id: 't-12', number: '12', locationId: 'loc-1', status: 'running', capacity: 4 },
  // Non A/C
  { id: 't-29', number: '1', locationId: 'loc-2', status: 'blank', capacity: 4 },
  { id: 't-30', number: '2', locationId: 'loc-2', status: 'reserved', capacity: 4 },
  { id: 't-31', number: '3', locationId: 'loc-2', status: 'blank', capacity: 4 },
  { id: 't-32', number: '4', locationId: 'loc-2', status: 'blank', capacity: 4 },
  { id: 't-33', number: '5', locationId: 'loc-2', status: 'running', capacity: 4 },
  { id: 't-36', number: '8', locationId: 'loc-2', status: 'running', capacity: 4 },
  { id: 't-37', number: '9', locationId: 'loc-2', status: 'blank', capacity: 4 },
  // Bar
  { id: 't-38', number: '1', locationId: 'loc-3', status: 'blank', capacity: 4 },
  { id: 't-39', number: '2', locationId: 'loc-3', status: 'reserved', capacity: 4 },
  { id: 't-40', number: '3', locationId: 'loc-3', status: 'blank', capacity: 4 },
  { id: 't-41', number: '4', locationId: 'loc-3', status: 'blank', capacity: 4 },
  { id: 't-42', number: '5', locationId: 'loc-3', status: 'blank', capacity: 4 },
];
