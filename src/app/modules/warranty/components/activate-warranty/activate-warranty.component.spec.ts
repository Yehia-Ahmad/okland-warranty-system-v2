import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateWarrantyComponent } from './activate-warranty.component';

describe('ActivateWarrantyComponent', () => {
  let component: ActivateWarrantyComponent;
  let fixture: ComponentFixture<ActivateWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateWarrantyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
