import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuOpen } from "../../../assets/menu-open/menu-open";
import { Mode } from "../../../assets/mode/mode";
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../shared/services/translation.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MoonComponent } from "../../../assets/moon/moon.component";
import { ThemeService } from '../../../shared/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, ButtonModule, MenuOpen, Mode, TranslatePipe, MoonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() collapsedSidenav = new EventEmitter<boolean>();
  isDarkMode$;
  collapsed = signal(false);
  i18n: any[] = [
    {
      name:'English',
      id:'en'
    },
    {
      name:'Arabic',
      id:'ar'
    },
    {
      name: 'Chinese',
      id: 'zh'
    }
  ];
  currentLang: string;

  constructor(private _languageService: LanguageService, private _themeService: ThemeService) {
    this.currentLang = _languageService.selectedLanguage();
    console.log(this.currentLang);
    this.isDarkMode$ = this._themeService.isDarkMode$

  }

  ngAfterViewInit() {
    this.toggleSidenav();
  }

  onLanguageChange(lang: string) {
    console.log(lang);
    this._languageService.changeLanguage(lang);
    this.currentLang = lang;
  }

  toggleSidenav() {
    this.collapsed.set(!this.collapsed());
    this.collapsedSidenav.emit(this.collapsed());
  }

  toggleDarkMode() {
    this._themeService.toggleTheme();
  }

}
