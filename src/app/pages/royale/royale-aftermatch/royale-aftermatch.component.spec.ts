import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaleAftermatchComponent } from './royale-aftermatch.component';

describe('RoyaleAftermatchComponent', () => {
  let component: RoyaleAftermatchComponent;
  let fixture: ComponentFixture<RoyaleAftermatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoyaleAftermatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoyaleAftermatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
