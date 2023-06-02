import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetaryOperationsComponent } from './monetary-operations.component';

describe('MonetaryOperationsComponent', () => {
  let component: MonetaryOperationsComponent;
  let fixture: ComponentFixture<MonetaryOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonetaryOperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonetaryOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
