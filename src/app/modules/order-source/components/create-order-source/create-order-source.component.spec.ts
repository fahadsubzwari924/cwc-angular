import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderSourceComponent } from './create-order-source.component';

describe('CreateOrderSourceComponent', () => {
  let component: CreateOrderSourceComponent;
  let fixture: ComponentFixture<CreateOrderSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrderSourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrderSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
