import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSourceComponent } from './order-source-list.component';

describe('OrderSourceComponent', () => {
  let component: OrderSourceComponent;
  let fixture: ComponentFixture<OrderSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderSourceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
