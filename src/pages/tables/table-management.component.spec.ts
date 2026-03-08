/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableManagementComponent } from './table-management.component';
import { of } from 'rxjs';
import { SheetService } from '@/components/sheet/sheet.service';
import { DialogService } from '@/components/dialog/dialog.service';

describe('TableManagementComponent', () => {
  let component: TableManagementComponent;
  let fixture: ComponentFixture<TableManagementComponent>;
  let sheetService: jasmine.SpyObj<SheetService>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    sheetService = jasmine.createSpyObj('SheetService', ['open']);
    dialogService = jasmine.createSpyObj('DialogService', ['open']);

    await TestBed.configureTestingModule({
      imports: [TableManagementComponent],
      providers: [
        { provide: SheetService, useValue: sheetService },
        { provide: DialogService, useValue: dialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableManagementComponent);
    component = fixture.componentInstance;
    // provide simple observables for stores (empty arrays)
    component.locations$ = of([]);
    component.tables$ = of([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clicking add location opens sheet', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.actions button');
    button.click();
    expect(sheetService.open).toHaveBeenCalled();
  });
});
