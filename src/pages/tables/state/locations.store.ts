import { createStore } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities } from '@ngneat/elf-entities';
import { Location } from '../models/location.model';
import { mockLocations } from '../mock-data';
import { Observable } from 'rxjs';

export const locationsStore = createStore(
  { name: 'locations' },
  withEntities<Location>()
);

// Initialize with mock data
locationsStore.update(setEntities(mockLocations));

// Selectors
export const locations$ = locationsStore.pipe(selectAllEntities()) as Observable<Location[]>;

// Updaters
export function addLocation(location: Location) {
  locationsStore.update(addEntities(location));
}

export function updateLocation(id: string, name: string) {
  locationsStore.update(updateEntities(id, { name }));
}

export function deleteLocation(id: string) {
  locationsStore.update(deleteEntities(id));
}
