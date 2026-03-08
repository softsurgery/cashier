/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationSectionComponent } from './location-section.component';
import { Location } from './models/location.model';
import { Table } from './models/table.model';

describe('LocationSectionComponent', () => {
  let component: LocationSectionComponent;
  let fixture: ComponentFixture<LocationSectionComponent>;

  const loc: Location = { id: 'loc1', name: 'Main' };
  const tables: Table[] = [
    { id: 't1', number: '1', locationId: 'loc1', status: 'blank', capacity: 4 },
    { id: 't2', number: '2', locationId: 'loc2', status: 'running', capacity: 2 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSectionComponent);
    component = fixture.componentInstance;
    component.location = loc;
    component.tables = tables;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calculates locationTables getter correctly', () => {
    expect(component.locationTables.length).toBe(1);
    expect(component.locationTables[0].locationId).toBe('loc1');
  });

  it('renders table-card for each matching table', () => {
    const cards = fixture.nativeElement.querySelectorAll('app-table-card');
    expect(cards.length).toBe(1);
  });
});
