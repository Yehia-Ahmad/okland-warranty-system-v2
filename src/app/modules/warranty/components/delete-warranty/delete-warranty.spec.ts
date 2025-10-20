import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWarranty } from './delete-warranty';

describe('DeleteWarranty', () => {
  let component: DeleteWarranty;
  let fixture: ComponentFixture<DeleteWarranty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteWarranty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteWarranty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
