import { ChangeDetectorRef, Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { InvoiceCard } from "../../../assets/invoice-card/invoice-card";
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { DiskService } from '../../../shared/services/disk.service';
import { Router } from '@angular/router';
import { ThemeService } from '../../../shared/services/theme.service';
import { DialogModule } from 'primeng/dialog';
import { ErrorIconComponent } from "../../../assets/error/error-icon.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule, ButtonModule, InvoiceCard, ReactiveFormsModule, DialogModule, ErrorIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isDarkMode$;
  errorVisible = false;
  errorMessage = '';

  constructor(private _themeService: ThemeService, private fb: FormBuilder, private _authService: Auth, private _diskService: DiskService, private _router: Router, private cdr: ChangeDetectorRef) {
    this.isDarkMode$ = this._themeService.isDarkMode$;
    this.initializeLoginForm();
  }

  initializeLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    let payload = this.loginForm.value;
    this._authService.login(payload).subscribe({
      next: (res: any) => {
        this._diskService.accessToken = res.data.token;
        this._diskService.user = res.data.user;
        this._router.navigate(['home']);
      },
      error: (error) => {
        this.errorVisible = true;
        this.errorMessage = error.error.message;
        this.cdr.detectChanges();
      }
    });
  }

}
