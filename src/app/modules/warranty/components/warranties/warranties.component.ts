import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { SideNavComponent } from '../../../layout/components/side-nav/side-nav.component';
import { WarnComponent } from "../../../assets/warn/warn.component";
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { WarrantyService } from '../../services/warranty.service';
import { FluidModule } from 'primeng/fluid';
import { DatePickerModule } from 'primeng/datepicker';
import { format } from 'date-fns';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../../shared/services/theme.service';
import { ErrorIconComponent } from "../../../assets/error/error-icon.component";
import { environment } from '../../../../../environments/environment';
import { QRCodeComponent } from "angularx-qrcode";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-warranties',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule, TableModule, SelectModule, ButtonModule, DialogModule, SideNavComponent, WarnComponent, DatePickerModule, FluidModule, TranslatePipe, ErrorIconComponent, QRCodeComponent, PaginationComponent],
  templateUrl: './warranties.component.html',
  styleUrl: './warranties.component.scss'
})
export class WarrantiesComponent {
  private baseUrl = environment.api_base_url;
  warranties: any[] = [];
  visible: boolean = false;
  deleteVisible: boolean = false;
  mode: string = 'add';
  changeForm: FormGroup;
  roles: any[] = [
    {
      name: 'Admin'
    },
    {
      name: 'Customer'
    }
  ];
  currentPage = 1;
  totalPages = 1;
  by_date: any;
  selectedWarranty: any = {};
  search: string;
  date: Date | string | undefined ;
  searchSubject = new Subject<string>();
  first1: number = 0;
  rows1: number = 0;
  isDarkMode$;
  errorVisible = false;
  errorMessage = '';
  selectedQr: any;
  warrantyURL: string;


  constructor(private _themeService: ThemeService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private _warrantyService: WarrantyService) {
    this.isDarkMode$ = this._themeService.isDarkMode$;
    this.initializeChangeForm();
  }

  ngOnInit() {
    this.getAllWarranties();

    this.searchSubject
      .pipe(
        debounceTime(500), // wait 500ms after user stops typing
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.search = value;
        this.getAllWarranties(); // trigger search
      });
  }

  getAllWarranties() {
    this.date && (this.date = format(this.date, 'yyyy-MM-dd'));
    let params = {
      page: this.currentPage,
      search: this.search,
      date: this.date
    }
    this._warrantyService.getAllWarranties(params).subscribe({
      next: (res: any) => {
        this.baseUrl = environment.api_base_url.replace('api/', 'api');
        console.log(this.baseUrl);
        res.data = res.data.map((warranty: any) => {
          return {
            ...warranty,
            fullUrl: `${this.baseUrl}${warranty.invoiceImage}`
          }
        });
        console.log(res);
        this.warranties = res.data;
        this.totalPages = res.pages;
        this.cdr.detectChanges();
      }, error: (err: any) => {
        this.errorVisible = true;
        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  initializeChangeForm() {
    this.changeForm = this.fb.group({
      username: [null],
      email: [null],
      phone_number: [null],
      password: [null],
      role: [null],
    });
  }

  showDialog(mode: string, warranty: any) {
    this.selectedWarranty = warranty;
    this.selectedQr = warranty.model.qrCodes.filter((qr: any) => qr.warranty == this.selectedWarranty._id)[0];
    this.warrantyURL = `${window.location.origin}/warranty-details/${this.selectedWarranty._id}`
    console.log(this.selectedWarranty);
    console.log(this.selectedQr);
    this.mode = mode;
    this.visible = true;
    this.cdr.detectChanges();
  }

  showDeleteDialog(warranty: any) {
    this.selectedWarranty = warranty;
    this.deleteVisible = true;
  }

  deleteWarranty() {
    this._warrantyService.deleteWarranty(this.selectedWarranty.id).subscribe({
      next: (res: any) => {
        this.getAllWarranties();
        this.deleteVisible = false;
        this.cdr.detectChanges();
      }, error: (err: any) => {
        this.errorVisible = true;
        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  closeDialog() {
    this.deleteVisible = false;
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
    }
  }

  onPageChange1(event: PaginatorState) {
    this.first1 = event.first ?? 0;
    this.rows1 = event.rows ?? 10;
  }
  
  onPageChange(page: number) {
    console.log('Selected page:', page);
    // call your API with new page here
    this.currentPage = page;
    this.getAllWarranties();
  }
}
