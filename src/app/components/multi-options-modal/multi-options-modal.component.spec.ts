import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiOptionsModalComponent } from './multi-options-modal.component';

describe('MultiOptionsModalComponent', () => {
  let component: MultiOptionsModalComponent;
  let fixture: ComponentFixture<MultiOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiOptionsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
