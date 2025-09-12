import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcadeMatchComponent } from './arcade-match.component';

describe('ArcadeMatchComponent', () => {
  let component: ArcadeMatchComponent;
  let fixture: ComponentFixture<ArcadeMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcadeMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArcadeMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
