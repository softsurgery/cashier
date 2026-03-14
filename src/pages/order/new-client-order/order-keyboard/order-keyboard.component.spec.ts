import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderKeyboardComponent } from './order-keyboard.component';

describe('OrderKeyboardComponent', () => {
  let component: OrderKeyboardComponent;
  let fixture: ComponentFixture<OrderKeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderKeyboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderKeyboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
