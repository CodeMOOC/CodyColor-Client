// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import components for each route
import { SplashComponent } from './pages/splash/splash.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './login/login.component';
import { RulesComponent } from './pages/rules/rules.component';
import { RandomMmakingComponent } from './pages/random-mmaking/random-mmaking.component';
import { CustomMmakingComponent } from './pages/custom/custom-mmaking/custom-mmaking.component';
import { RoyaleMmakingComponent } from './pages/royale/royale-mmaking/royale-mmaking.component';
import { CustomNewMatchComponent } from './pages/custom/custom-new-match/custom-new-match.component';
import { RoyaleNewMatchComponent } from './pages/royale/royale-new-match/royale-new-match.component';
import { ArcadeMatchComponent } from './pages/arcade/arcade-match/arcade-match.component';
import { ArcadeAftermatchComponent } from './pages/arcade/arcade-aftermatch/arcade-aftermatch.component';
import { RoyaleMatchComponent } from './pages/royale/royale-match/royale-match.component';
import { RoyaleAftermatchComponent } from './pages/royale/royale-aftermatch/royale-aftermatch.component';
import { BootmpMmakingComponent } from './pages/bootmp/bootmp-mmaking/bootmp-mmaking.component';
import { BootmpMatchComponent } from './pages/bootmp/bootmp-match/bootmp-match.component';
import { BootmpAftermatchComponent } from './pages/bootmp/bootmp-aftermatch/bootmp-aftermatch.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { RankingsComponent } from './pages/rankings/rankings.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'random-mmaking', component: RandomMmakingComponent },
  { path: 'custom-mmaking', component: CustomMmakingComponent },
  { path: 'royale-mmaking', component: RoyaleMmakingComponent },
  { path: 'custom-new-match', component: CustomNewMatchComponent },
  { path: 'royale-new-match', component: RoyaleNewMatchComponent },
  { path: 'arcade-match', component: ArcadeMatchComponent },
  { path: 'arcade-aftermatch', component: ArcadeAftermatchComponent },
  { path: 'royale-match', component: RoyaleMatchComponent },
  { path: 'royale-aftermatch', component: RoyaleAftermatchComponent },
  { path: 'bootmp-mmaking', component: BootmpMmakingComponent },
  { path: 'bootmp-match', component: BootmpMatchComponent },
  { path: 'bootmp-aftermatch', component: BootmpAftermatchComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'rankings', component: RankingsComponent },
  { path: '**', component: NotFoundComponent }, // fallback route (404)
];
