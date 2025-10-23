import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleOptionModalComponent } from './single-option-modal.component';

describe('SingleOptionModalComponent', () => {
  let component: SingleOptionModalComponent;
  let fixture: ComponentFixture<SingleOptionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleOptionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleOptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
