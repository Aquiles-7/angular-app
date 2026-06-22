import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityButton } from './quantity-button';

describe('QuantityButton', () => {
  let component: QuantityButton;
  let fixture: ComponentFixture<QuantityButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityButton],
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
