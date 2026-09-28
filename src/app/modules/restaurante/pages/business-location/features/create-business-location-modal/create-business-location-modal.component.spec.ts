import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusinessLocationModalComponent } from './create-business-location-modal.component';

describe('CreateBusinessLocationModalComponent', () => {
  let component: CreateBusinessLocationModalComponent;
  let fixture: ComponentFixture<CreateBusinessLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBusinessLocationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBusinessLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
