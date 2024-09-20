import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersReportComponent } from './orders-report.component';

describe('OrdersReportComponent', () => {
  let component: OrdersReportComponent;
  let fixture: ComponentFixture<OrdersReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
