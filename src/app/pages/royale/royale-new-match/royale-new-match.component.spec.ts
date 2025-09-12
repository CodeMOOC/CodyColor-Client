import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaleNewMatchComponent } from './royale-new-match.component';

describe('RoyaleNewMatchComponent', () => {
  let component: RoyaleNewMatchComponent;
  let fixture: ComponentFixture<RoyaleNewMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoyaleNewMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoyaleNewMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
