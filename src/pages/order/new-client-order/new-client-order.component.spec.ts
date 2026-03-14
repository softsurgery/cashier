import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewClientOrderComponent } from './new-client-order.component';

describe('CaisseComponent', () => {
  let component: NewClientOrderComponent;
  let fixture: ComponentFixture<NewClientOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewClientOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewClientOrderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
