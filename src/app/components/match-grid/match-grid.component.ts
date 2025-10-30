import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Tile, Side } from '../../models/cell.model';
import { Path } from '../../models/path.model';
import {
  CdkDrag,
  DragDropModule,
  CdkDropList,
  CdkDropListGroup,
  CdkDragMove,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RobyAnimationComponent } from '../roby-animation/roby-animation.component';
import { MatchManagerService } from '../../services/match-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-grid',
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    TranslateModule,
    CdkDropListGroup,
    DragDropModule,
    RobyAnimationComponent,
  ],
  templateUrl: './match-grid.component.html',
  styleUrl: './match-grid.component.scss',
})
export class MatchGridComponent {
  @Input() tilesCss: string[][] = [];
  @Input() grid: Tile[][] = [];
  @Input() executeAnimation = false;
  @Input() showCompleteGrid = false;
  @Input() playerPath?: Path;
  @Input() enemyPaths?: Path[];
  @Input() botSetting = 0;
  @Input() Side = Side;
  @Input() endRoute: string = '';

  /** Outputs */
  @Output() tileDropped = new EventEmitter<{ side: Side; distance: number }>();
  @Output() dragStarted = new EventEmitter<void>();
  @Output() dragEnded = new EventEmitter<void>();

  /** State */
  isDragging = false;
  isOverArrow = false;
  currentSide: Side | null = null;
  currentIndex: number | null = null;
  rectCurrentArrow: any;

  @ViewChildren('arrowCell', { read: ElementRef })
  arrowElements!: QueryList<ElementRef>;

  @ViewChild('player') playerAnim?: RobyAnimationComponent;
  @ViewChild('enemy') enemyAnim?: RobyAnimationComponent;

  constructor(
    private matchManager: MatchManagerService,
    private router: Router
  ) {}

  /** --- Drag & Drop handlers --- */
  onDragStarted(event: any): void {
    this.isDragging = true;
    this.dragStarted.emit();
  }

  onDragMoved(event: CdkDragMove): void {
    const pointerX = event.pointerPosition.x;
    const pointerY = event.pointerPosition.y;

    let found = false;
    const arrowEls = document.querySelectorAll('.arrow-cell');
    arrowEls.forEach((el: any) => {
      const rect = el.getBoundingClientRect();
      if (
        pointerX >= rect.left &&
        pointerX <= rect.right &&
        pointerY >= rect.top &&
        pointerY <= rect.bottom
      ) {
        this.isOverArrow = true;
        this.currentSide = Number(el.dataset.side) as Side;
        this.currentIndex = Number(el.dataset.index);
        this.rectCurrentArrow = rect;
        found = true;
      }
    });

    if (!found) {
      this.isOverArrow = false;
      this.currentSide = null;
      this.currentIndex = null;
    }
  }

  onDragEnded(): void {
    this.isDragging = false;
    this.dragEnded.emit();

    if (
      this.isOverArrow &&
      this.currentSide !== null &&
      this.currentIndex !== null
    ) {
      this.tileDropped.emit({
        side: this.currentSide,
        distance: this.currentIndex,
      });
    }

    this.isOverArrow = false;
    this.currentSide = null;
    this.currentIndex = null;
  }

  /** Utility to choose arrow icon */
  getArrowIcon(side: Side): string {
    switch (side) {
      case Side.Top:
        return 'keyboard_arrow_down';
      case Side.Bottom:
        return 'keyboard_arrow_up';
      case Side.Left:
        return 'keyboard_arrow_right';
      case Side.Right:
        return 'keyboard_arrow_left';
      default:
        return '';
    }
  }

  // cosa fare una volta terminata senza intoppi la partita; mostra la schermata aftermatch
  executeEndSequence(playerType?: 'player' | 'enemy') {
    if (playerType === 'player') this.playerAnim?.play();
    if (playerType === 'enemy') this.enemyAnim?.play();

    // Delegate scoring, winner determination, navigation

    this.matchManager.executeEndSequence(playerType, {
      onComplete: () => this.router.navigate([this.endRoute]),
    });
  }
}
