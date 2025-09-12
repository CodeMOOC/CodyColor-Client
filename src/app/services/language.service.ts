import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private defaultLang = 'it';
  private supportedLangs = ['it', 'en', 'hu'];

  constructor(private translate: TranslateService) {
    this.initLanguage();
  }

  private initLanguage(): void {
    this.translate.addLangs(this.supportedLangs);
    this.translate.setDefaultLang(this.defaultLang);

    const savedLang = localStorage.getItem('language');
    const browserLang = this.translate.getBrowserLang() ?? '';

    const langToUse =
      savedLang && this.supportedLangs.includes(savedLang)
        ? savedLang
        : this.supportedLangs.includes(browserLang)
        ? browserLang
        : this.defaultLang;

    this.translate.use(langToUse);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang;
  }

  changeLanguage(lang: string): void {
    if (this.supportedLangs.includes(lang)) {
      this.translate.use(lang);
      localStorage.setItem('language', lang);
    }
  }

  getSupportedLanguages(): string[] {
    return this.supportedLangs;
  }

  async translateM(key: string): Promise<string> {
    return firstValueFrom(this.translate.get(key));
  }

  async setTranslation(targetKey: string, sourceKey: string): Promise<string> {
    const translatedValue = await this.translateM(sourceKey);
    this.translate.setTranslation(
      this.getCurrentLanguage(),
      {
        [targetKey]: translatedValue,
      },
      true
    );
    return translatedValue;
  }
}
