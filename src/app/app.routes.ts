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
import { NewMatchComponent } from './pages/custom/new-match/new-match.component';
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
import { sessionGuard } from './guards/session.guard';
import { exitGameGuard } from './guards/exit-game.guard';

export const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [sessionGuard],
  },
  { path: 'rules', component: RulesComponent },
  {
    path: 'random-mmaking',
    component: RandomMmakingComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'random-mmaking' },
  },
  {
    path: 'custom-mmaking',
    component: CustomMmakingComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'custom-mmaking' },
  },
  {
    path: 'royale-mmaking',
    component: RoyaleMmakingComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'royale-mmaking' },
  },
  {
    path: 'custom-new-match',
    component: NewMatchComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'custom-new-match' },
  },
  {
    path: 'royale-new-match',
    component: RoyaleNewMatchComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'royale-new-matchh' },
  },
  {
    path: 'arcade-match',
    component: ArcadeMatchComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'arcade-match' },
  },
  {
    path: 'arcade-aftermatch',
    component: ArcadeAftermatchComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'arcade-aftermatch' },
  },
  {
    path: 'royale-match',
    component: RoyaleMatchComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'royale-match' },
  },
  {
    path: 'royale-aftermatch',
    component: RoyaleAftermatchComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'royale-aftermatch' },
  },
  {
    path: 'bootmp-mmaking',
    component: BootmpMmakingComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'boottmp-mmaking' },
  },
  {
    path: 'bootmp-match',
    component: BootmpMatchComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'boottmp-match' },
  },
  {
    path: 'bootmp-aftermatch',
    component: BootmpAftermatchComponent,
    canActivate: [sessionGuard],
    canDeactivate: [exitGameGuard],
    data: { gameMode: 'boottmp-aftermatch' },
  },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'rankings', component: RankingsComponent },
  { path: '**', component: NotFoundComponent }, // fallback route (404)
];
