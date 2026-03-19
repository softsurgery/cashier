import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProductFamilyComponent } from './order-product-family.component';

describe('OrderProductFamilyComponent', () => {
  let component: OrderProductFamilyComponent;
  let fixture: ComponentFixture<OrderProductFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderProductFamilyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProductFamilyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
