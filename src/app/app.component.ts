import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/shared/footer/footer.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FooterComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'CodyColor-Client';

  showFooter = true;

  // firestore and auth instances
  firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showFooter = event.urlAfterRedirects !== '/';
      });
  }

  ngOnInit() {
    // watch auth state
    onAuthStateChanged(this.auth, (user) => {
      console.log('User:', user);
    });
  }
}
