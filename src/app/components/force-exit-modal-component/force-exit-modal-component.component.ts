// force-exit-modal.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-force-exit-modal',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <div class="modal">
      <div class="modal--content">
        <!-- <h2 mat-dialog-title>{{ data.title }}</h2> -->
        <p>{{ data.message }}</p>
        <div class="modal--buttons-container">
          <button class="modal--button-primary" (click)="close()">
            {{ 'OK' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ForceExitModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    private dialogRef: MatDialogRef<ForceExitModalComponent>
  ) {}

  close() {
    this.dialogRef.close(true);
  }
}
