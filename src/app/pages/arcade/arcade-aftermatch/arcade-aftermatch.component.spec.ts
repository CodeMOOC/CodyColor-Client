import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcadeAftermatchComponent } from './arcade-aftermatch.component';

describe('ArcadeAftermatchComponent', () => {
  let component: ArcadeAftermatchComponent;
  let fixture: ComponentFixture<ArcadeAftermatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcadeAftermatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArcadeAftermatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
