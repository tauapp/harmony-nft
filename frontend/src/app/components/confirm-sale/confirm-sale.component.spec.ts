import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSaleComponent } from './confirm-sale.component';

describe('ConfirmSaleComponent', () => {
  let component: ConfirmSaleComponent;
  let fixture: ComponentFixture<ConfirmSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
