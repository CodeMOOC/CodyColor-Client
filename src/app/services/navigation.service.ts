import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private backBlock = true;

  constructor(private router: Router, private location: Location) {
    this.initBackNavigationBlock();
  }

  // Block browser back button
  private initBackNavigationBlock(): void {
    history.pushState(null, '', location.href);
    window.addEventListener('popstate', () => {
      if (this.backBlock) {
        alert('Use the in-game buttons to navigate!');
        history.pushState(null, '', location.href); // re-push to block
      } else {
        this.backBlock = true; // reset for next time
      }
    });
  }

  public blockBackNavigation(): void {
    this.backBlock = true;
  }

  public allowBackNavigationOnce(): void {
    this.backBlock = false;
  }

  public goToPage(path: string): void {
    this.allowBackNavigationOnce(); // allow navigation on this event
    this.router.navigate([path], { queryParams: {} });
  }
}
