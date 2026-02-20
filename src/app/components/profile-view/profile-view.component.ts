import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppUser, ServerUserData } from '../../models/user.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RabbitService } from '../../services/rabbit.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-view',
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.scss',
})
export class ProfileViewComponent implements OnInit {
  @Input() serverUser!: ServerUserData;
  @Input() firebaseUser: any;

  @Output() logout = new EventEmitter<void>();
  @Output() deleteAccount = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();

  editMode = false;
  editableNickname = '';

  constructor(
    private auth: AuthService,
    private rabbitService: RabbitService
  ) {}

  ngOnInit(): void {}

  // Default avatar if Firebase photoURL is missing
  get avatarUrl(): string {
    const url = this.firebaseUser?.photoURL;
    return url ? url : 'assets/img/user-avatar.png';
  }

  enterEditMode() {
    this.editMode = true;
    this.editableNickname = this.serverUser.nickname;
  }

  async saveNickname() {
    await this.rabbitService.waitForBrokerConnection();

    this.serverUser.nickname = this.editableNickname.trim();
    this.rabbitService.sendEditNicknameRequest(
      this.firebaseUser.uid,
      this.serverUser.nickname
    );
    this.auth.setServerUserData(this.serverUser);

    this.editMode = false;
  }

  cancelEdit() {
    this.editMode = false;
    this.editableNickname = this.serverUser.nickname;
  }
}
