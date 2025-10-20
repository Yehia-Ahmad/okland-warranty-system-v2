import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantiesComponent } from './warranties.component';

describe('Warranties', () => {
  let component: WarrantiesComponent;
  let fixture: ComponentFixture<WarrantiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrantiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarrantiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
