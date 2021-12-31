import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmBuyComponent } from './confirm-buy.component';

describe('ConfirmBuyComponent', () => {
  let component: ConfirmBuyComponent;
  let fixture: ComponentFixture<ConfirmBuyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmBuyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
