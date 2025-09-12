import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  CdkDropList,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { GameDataService } from '../../services/game-data.service';
import { PathService } from '../../services/path.service';
import { NavigationService } from '../../services/navigation.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GameSettings } from '../../models/gameSettings.model';
import { Match } from '../../models/match.model';
import { Player } from '../../models/player.model';
import { AudioService } from '../../services/audio.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';
import { SessionService } from '../../services/session.service';
import { VisibilityService } from '../../services/visibility.service';
import { Cell } from '../../models/cell.model';

@Component({
  selector: 'app-test-drag',
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    TranslateModule,
    DragDropModule,
  ],
  templateUrl: './test-drag.component.html',
  styleUrl: './test-drag.component.scss',
})
export class TestDragComponent {
  movies = [
    {
      title: 'Episode I - The Phantom Menace',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/4/40/Star_Wars_Phantom_Menace_poster.jpg',
    },
    {
      title: 'Episode II - Attack of the Clones',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/3/32/Star_Wars_-_Episode_II_Attack_of_the_Clones_%28movie_poster%29.jpg',
    },
    {
      title: 'Episode III - Revenge of the Sith',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/9/93/Star_Wars_Episode_III_Revenge_of_the_Sith_poster.jpg',
    },
    {
      title: 'Episode IV - A New Hope',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/8/87/StarWarsMoviePoster1977.jpg',
    },
    {
      title: 'Episode V - The Empire Strikes Back',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/3/3f/The_Empire_Strikes_Back_%281980_film%29.jpg',
    },
    {
      title: 'Episode VI - Return of the Jedi',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/b/b2/ReturnOfTheJediPoster1983.jpg',
    },
    {
      title: 'Episode VII - The Force Awakens',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/a/a2/Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg',
    },
    {
      title: 'Episode VIII - The Last Jedi',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/7/7f/Star_Wars_The_Last_Jedi.jpg',
    },
    {
      title: 'Episode IX – The Rise of Skywalker',
      poster:
        'https://upload.wikimedia.org/wikipedia/en/a/af/Star_Wars_The_Rise_of_Skywalker_poster.jpg',
    },
  ];
  // tslint:enable:max-line-length
  drop(event: CdkDragDrop<{ title: string; poster: string }[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }
}
