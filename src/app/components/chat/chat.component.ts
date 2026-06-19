import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Bubble } from '../../models/bubble.model';
import { ChatHandlerService } from '../../services/chat.service';
import { RabbitService } from '../../services/rabbit.service';
import { AudioService } from '../../services/audio.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, TranslateModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() playerId!: number;
  @Input() chatBubbles: Bubble[] = [];
  @Input() chatHints: string[] = [];
  @Output() messageSent = new EventEmitter<string>();

  bubble: Bubble = {
    id: '',
    body: '',
    sender: '',
  };
  chatVisible = false;

  constructor(private audio: AudioService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
  getBubbleStyle(bubble: any) {
    return bubble.playerId === this.playerId
      ? 'chat--bubble-player'
      : 'chat--bubble-enemy';
  }

  sendChatMessage(messageBody: string) {
    this.audio.playSound('menu-click');
    this.messageSent.emit(messageBody);
  }
}
