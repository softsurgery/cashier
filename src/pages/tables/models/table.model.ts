export type TableStatus = 'blank' | 'running' | 'reserved';

export interface Table {
  id: string;
  number: string;
  locationId: string;
  status: TableStatus;
  capacity: number; // added from the dialog
}
