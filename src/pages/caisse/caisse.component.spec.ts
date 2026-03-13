import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseComponent } from './caisse.component';

describe('CaisseComponent', () => {
  let component: CaisseComponent;
  let fixture: ComponentFixture<CaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaisseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaisseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
