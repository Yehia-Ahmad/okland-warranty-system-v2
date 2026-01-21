import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Mode } from "../../../assets/mode/mode";
import { UploadComponent } from "../../../assets/upload/upload.component";
import { WarrantyService } from '../../services/warranty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from "date-fns";
import { DialogModule } from 'primeng/dialog';
import { ThemeService } from '../../../shared/services/theme.service';
import { ErrorIconComponent } from "../../../assets/error/error-icon.component";
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/translation.service';
import { MoonComponent } from "../../../assets/moon/moon.component";
import { CateoryService } from '../../../category/services/cateory.service';

@Component({
  selector: 'app-activate-warranty',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, Mode, UploadComponent, DialogModule, ErrorIconComponent, TranslatePipe, MoonComponent],
  templateUrl: './activate-warranty.component.html',
  styleUrl: './activate-warranty.component.scss'
})
export class ActivateWarrantyComponent {
  isLoading = false;
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
  imagePreview: string | ArrayBuffer | null = null;
  activateForm: any = {
    qrCode: null,
    username: null,
    number: null,
    branchName: null,
    branchNumber: null,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    duration: 365,
    invoiceImage: null
  };
  errorVisible = false;
  errorMessage = '';

  constructor(private _cateoryService: CateoryService, private _warrantyService: WarrantyService, private _activatedRoute: ActivatedRoute, private _languageService: LanguageService, private _themeService: ThemeService, private cdr: ChangeDetectorRef, private _router: Router) {
    this.isDarkMode$ = this._themeService.isDarkMode$;
    this.activateForm.qrCode = this._activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.verifyWarranty()
  }

  verifyWarranty() {
    this.isLoading = true;
    this._cateoryService.veryQrCode(this.activateForm.qrCode).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this._router.navigate(['/warranty-details', res.data.warrantyId]);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorVisible = true;
        this.errorMessage = err.error.message;
      }
    });
  }

  onLanguageChange(lang: string) {
    console.log(lang);
    this._languageService.changeLanguage(lang);
    this.currentLang = lang;
  }

  activateWarranty() {
    this.isLoading = true;
    let formData = new FormData();
    formData.append('qrCode', this.activateForm.qrCode);
    formData.append('username', this.activateForm.username);
    formData.append('number', this.activateForm.number);
    formData.append('branchName', this.activateForm.branchName);
    formData.append('branchNumber', this.activateForm.branchNumber);
    formData.append('startDate', this.activateForm.startDate);
    formData.append('duration', this.activateForm.duration);
    formData.append('invoiceImage', this.activateForm.invoiceImage);
    console.log(this.activateForm);
    this._warrantyService.activateWarranty(this.activateForm).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this._router.navigate(['/warranty-details', res.data.warrantyId]);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorVisible = true;
        this.errorMessage = err.error.message;
      }
    });
  }

  onBasicUploadAuto(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Optional: show image preview
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
        this.activateForm.invoiceImage = base64String;
      };
      reader.readAsDataURL(file);

      // Prepare FormData to send binary
      const formData = new FormData();
      // this.activateForm.invoiceImage = this.imagePreview; // 'invoiceImage' is the backend field name
      console.log(formData.get('invoiceImage'));
    }
  }


  toggleDarkMode() {
    this._themeService.toggleTheme();
  }
}
