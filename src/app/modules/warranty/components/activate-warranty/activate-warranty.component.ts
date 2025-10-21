import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { Mode } from "../../../assets/mode/mode";
import { UploadComponent } from "../../../assets/upload/upload.component";
import { WarrantyService } from '../../services/warranty.service';
import { ActivatedRoute } from '@angular/router';
import { format } from "date-fns";
import { DialogModule } from 'primeng/dialog';
import { ThemeService } from '../../../shared/services/theme.service';
import { ErrorIconComponent } from "../../../assets/error/error-icon.component";
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/translation.service';

@Component({
  selector: 'app-activate-warranty',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectModule, Mode, UploadComponent, DialogModule, ErrorIconComponent, TranslatePipe],
  templateUrl: './activate-warranty.component.html',
  styleUrl: './activate-warranty.component.scss'
})
export class ActivateWarrantyComponent {
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
  
  constructor(private _warrantyService: WarrantyService, private _activatedRoute: ActivatedRoute, private _languageService: LanguageService, private _themeService: ThemeService) {
    this.isDarkMode$ = this._themeService.isDarkMode$;
    this.activateForm.qrCode = this._activatedRoute.snapshot.params['id'];
  }

  ngOnInit() { }


  onLanguageChange(lang: string) {
    console.log(lang);
    this._languageService.changeLanguage(lang);
    this.currentLang = lang;
  }

  activateWarranty() {
    let formData = new FormData();
    formData.append('qrCode', this.activateForm.qrCode);
    formData.append('username', this.activateForm.username);
    formData.append('number', this.activateForm.number);
    formData.append('branchName', this.activateForm.branchName);
    formData.append('branchNumber', this.activateForm.branchNumber);
    formData.append('startDate', this.activateForm.startDate);
    formData.append('duration', this.activateForm.duration);
    formData.append('invoiceImage', this.activateForm.invoiceImage);
    this._warrantyService.activateWarranty(formData).subscribe({
      next: (res: any) => {
        window.close();
      },
      error: (err: any) => {
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
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Prepare FormData to send binary
      const formData = new FormData();
      this.activateForm.invoiceImage = file; // 'invoiceImage' is the backend field name
      console.log(formData.get('invoiceImage'));
    }
  }

}
