import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
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
  CdkDragEnd,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RobyAnimationComponent } from '../roby-animation/roby-animation.component';
import { MatchManagerService } from '../../services/match-manager.service';
import { Router } from '@angular/router';
import { RabbitService } from '../../services/rabbit.service';

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
export class MatchGridComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() tilesCss: string[][] = [];
  @Input() isBot: boolean = false;
  @Input() grid: Tile[][] = [];
  @Input() executeAnimation = false;
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

  @ViewChild('smallGridRef') smallGridRef!: ElementRef;
  gridRect: DOMRect | null = null;

  releasePosition = { x: 0, y: 0 };
  isReturning = false;
  showCompleteGrid = false;

  isPlayerAnimationDone = false;
  isEnemyAnimationDone = false;

  constructor(
    private matchManager: MatchManagerService,
    private rabbit: RabbitService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('executeAnimation', this.executeAnimation);
    console.log('playerPath', this.playerPath);
  }

  ngAfterViewInit(): void {
    const el = this.smallGridRef?.nativeElement as HTMLElement;
    if (el) this.gridRect = el.getBoundingClientRect();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['executeAnimation']) {
      console.log('executeAnimation changed:', this.executeAnimation);
      this.handleAnimationState();
    }

    if (changes['playerPath']) {
      console.log('playerPath changed:', this.playerPath);
      this.handlePlayerPathChange();
    }

    if (changes['enemyPaths']) {
      console.log('enemyPaths changed:', this.enemyPaths);
      this.handleEnemyPathChange();
    }
  }

  private handleAnimationState() {
    if (this.executeAnimation && this.playerPath) {
      console.log('→ READY to run player animation');
      // optionally start animation or let HTML *ngIf create the component
    }
  }

  private handlePlayerPathChange() {
    if (this.playerPath) {
      console.log('→ PLAYER PLACED ROBOT');
      // show robot, compute position, etc.
    }
  }

  private handleEnemyPathChange() {
    if (this.enemyPaths?.length) {
      console.log('→ ENEMY PATHS RECEIVED');
    }
  }

  /** --- Drag & Drop handlers --- */
  onDragStarted(event: any): void {
    this.showCompleteGrid = true;
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

  onDragEnded(event: CdkDragEnd): void {
    this.isDragging = false;
    this.dragEnded.emit();

    if (
      this.isOverArrow &&
      this.currentSide !== null &&
      this.currentIndex !== null
    ) {
      this.showCompleteGrid = true;
      this.tileDropped.emit({
        side: this.currentSide,
        distance: this.currentIndex,
      });
    } else {
      this.showCompleteGrid = false;

      const { x, y } = event.source.getFreeDragPosition();
      this.releasePosition = { x, y };
      this.playReturnAnimation();
    }

    this.isOverArrow = false;
    this.currentSide = null;
    this.currentIndex = null;
  }

  // NOT WORKING
  playReturnAnimation() {
    this.isReturning = true;

    // Wait one frame to apply the target style
    requestAnimationFrame(() => {
      const el = document.querySelector('.returning-roby') as HTMLElement;
      if (el) el.classList.add('returning');
    });

    // Clean up after animation
    setTimeout(() => {
      this.isReturning = false;
    }, 1000);
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
    if (playerType === 'player') {
      this.isPlayerAnimationDone = true;
      this.playerAnim?.play();
    }
    if (playerType === 'enemy') {
      this.isEnemyAnimationDone = true;
      this.enemyAnim?.play();
    }

    // if (
    //   (this.isPlayerAnimationDone && this.isEnemyAnimationDone) ||
    //   this.isBot
    // ) {
    this.rabbit.sendEndAnimationMessage();

    const isSinglePlayer = this.isBot && this.enemyPaths?.length === 0;
    // Delegate scoring, winner determination, navigation
    this.matchManager.executeEndSequence(playerType, isSinglePlayer, {
      onComplete: () => {
        if (this.isBot) this.router.navigate([this.endRoute]);
        // this.rabbit.sendEndAnimationMessage();
      },
    });
    // }
  }
}
