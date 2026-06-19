// modal.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ForceExitModalComponent } from '../components/force-exit-modal-component/force-exit-modal-component.component';

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(private dialog: MatDialog, private translate: TranslateService) {}

  async showForceExitModal(translationKey: string): Promise<void> {
    const message = await firstValueFrom(this.translate.get(translationKey));

    await firstValueFrom(
      this.dialog
        .open(ForceExitModalComponent, {
          data: { title: 'Attention', message },
          disableClose: true,
        })
        .afterClosed()
    );
  }
}
