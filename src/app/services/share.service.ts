import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor() {}

  /**
   * Copy text to clipboard using the modern Clipboard API.
   */
  copyTextToClipboard(text: string): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch((err) => {
        console.error('Clipboard write failed', err);
      });
    } else {
      // Legacy fallback (in case clipboard API not supported)
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy'); // ⚠️ Deprecated, but fallback
      document.body.removeChild(el);
    }
  }

  /**
   * Try to use the Web Share API; if not supported, copy to clipboard.
   * Returns `true` if legacy clipboard fallback was used.
   */
  shareText(title: string, text: string, url: string): boolean {
    let legacy = false;

    if (navigator.share) {
      navigator
        .share({ title, text, url })
        .then(() => console.log('Thanks for sharing!'))
        .catch((err) => console.error('Share failed', err));
    } else {
      legacy = true;
      this.copyTextToClipboard(`${text} Play with me in ${url}`);
    }

    return legacy;
  }
}
