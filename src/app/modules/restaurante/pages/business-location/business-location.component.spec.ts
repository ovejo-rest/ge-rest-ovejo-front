import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLocationComponent } from './business-location.component';

describe('BusinessLocationComponent', () => {
  let component: BusinessLocationComponent;
  let fixture: ComponentFixture<BusinessLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
