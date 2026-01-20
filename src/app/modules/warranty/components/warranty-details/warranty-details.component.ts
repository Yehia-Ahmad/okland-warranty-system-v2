import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { Mode } from '../../../assets/mode/mode';
import { ThemeService } from '../../../shared/services/theme.service';
import { LanguageService } from '../../../shared/services/translation.service';
import { WarrantyService } from '../../services/warranty.service';
import { MoonComponent } from "../../../assets/moon/moon.component";

@Component({
  selector: 'app-warranty-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, Mode, DialogModule, TranslatePipe, MoonComponent],
  templateUrl: './warranty-details.component.html',
  styleUrl: './warranty-details.component.scss'
})
export class WarrantyDetailsComponent {
  i18n: any[] = [
    {
      name: 'English',
      id: 'en'
    },
    {
      name: 'Arabic',
      id: 'ar'
    },
    {
      name: 'Chinese',
      id: 'zh'
    }
  ];
  currentLang: string;
  isDarkMode$;
  selectedLanguage: string = this.i18n[0];
  selectedProduct: any = {};

  constructor(private _warrantyService: WarrantyService, private _activatedRoute: ActivatedRoute, private _languageService: LanguageService, private _themeService: ThemeService, private cdr: ChangeDetectorRef) {
    this.isDarkMode$ = this._themeService.isDarkMode$;
    // this.activateForm.qrCode = this._activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.getWarrantyDetails()
  }


  onLanguageChange(lang: string) {
    this._languageService.changeLanguage(lang);
    this.currentLang = lang;
  }

  getWarrantyDetails() {
    this._warrantyService.getWarrantyById(this._activatedRoute.snapshot.params['id']).subscribe({
      next: (res: any) => {
        this.selectedProduct = res.data;
        this.cdr.detectChanges();
      },
      error: (err: any) => { }
    })
  }

  toggleDarkMode() {
    this._themeService.toggleTheme();
  }
}
