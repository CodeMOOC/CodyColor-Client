import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-language',
  imports: [],
  templateUrl: './dialog-language.component.html',
  styleUrl: './dialog-language.component.scss',
})
export class DialogLanguageComponent {
  constructor(public dialogRef: MatDialogRef<DialogLanguageComponent>) {}

  changeLanguage(lang: string) {
    this.dialogRef.close(lang);
  }
}
