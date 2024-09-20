import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepBarGraphComponent } from './deep-bar-graph.component';

describe('DeepBarGraphComponent', () => {
  let component: DeepBarGraphComponent;
  let fixture: ComponentFixture<DeepBarGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeepBarGraphComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeepBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
