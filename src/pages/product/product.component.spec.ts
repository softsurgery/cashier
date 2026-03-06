import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFamilyComponent } from './product.component';

describe('ProductFamilyComponent', () => {
  let component: ProductFamilyComponent;
  let fixture: ComponentFixture<ProductFamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFamilyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFamilyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
