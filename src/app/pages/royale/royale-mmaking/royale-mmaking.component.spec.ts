import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoyaleMmakingComponent } from './royale-mmaking.component';

describe('RoyaleMmakingComponent', () => {
  let component: RoyaleMmakingComponent;
  let fixture: ComponentFixture<RoyaleMmakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoyaleMmakingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoyaleMmakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
