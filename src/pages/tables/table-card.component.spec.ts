/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCardComponent } from './table-card.component';
import { Table } from './models/table.model';

describe('TableCardComponent', () => {
  let component: TableCardComponent;
  let fixture: ComponentFixture<TableCardComponent>;

  const mockTable: Table = {
    id: '1',
    number: 'A1',
    locationId: 'loc1',
    status: 'blank',
    capacity: 4,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableCardComponent);
    component = fixture.componentInstance;
    component.table = mockTable;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays number and status', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Table A1');
    expect(el.textContent).toContain('Blank');
  });

  it('emits edit event when edit button clicked', () => {
    spyOn(component.edit, 'emit');
    const btn = fixture.nativeElement.querySelector('button[mat-icon-button]');
    btn.click();
    expect(component.edit.emit).toHaveBeenCalledWith(mockTable);
  });

  it('emits delete event when delete button clicked', () => {
    spyOn(component.delete, 'emit');
    const buttons = fixture.nativeElement.querySelectorAll('button[mat-icon-button]');
    buttons[1].click();
    expect(component.delete.emit).toHaveBeenCalledWith(mockTable.id);
  });
});
