import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaleMatchComponent } from './royale-match.component';

describe('RoyaleMatchComponent', () => {
  let component: RoyaleMatchComponent;
  let fixture: ComponentFixture<RoyaleMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoyaleMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoyaleMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
