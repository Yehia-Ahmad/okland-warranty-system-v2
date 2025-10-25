import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CateoryService } from '../../services/cateory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SideNavComponent } from "../../../layout/components/side-nav/side-nav.component";
import { DialogModule } from "primeng/dialog";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from "primeng/select";
import { environment } from '../../../../../environments/environment';
import { QRCodeComponent } from 'angularx-qrcode';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../../shared/services/theme.service';
import { ErrorIconComponent } from "../../../assets/error/error-icon.component";

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    QRCodeComponent,
    SideNavComponent,
    SelectModule,
    TranslatePipe,
    ErrorIconComponent
],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss'
})
export class CategoryDetailsComponent {
  private baseUrl = environment.api_base_url2;
  categoryId: number;
  categoryDetails: any;
  visible: boolean = false;
  categories: any[] = [];
  addProductForm: FormGroup;
  products: any[] = [];
  qrCodes: any[] = [];
  codes: string[] = [];
  selectedProduct: any;
  imagePreview: string | ArrayBuffer | null = null;
  name: string;
  quantity: number;
  showAddModelDialog: boolean = false;
  showModelQrCodesDialog: boolean = false;

  // ✅ Loading flags for button disable state
  isLoading: boolean = false;
  isAddingProduct: boolean = false;
  isCreatingModel: boolean = false;
  isCreatingQrCodes: boolean = false;
  isPrinting: boolean = false;
  isDarkMode$;
  errorVisible = false;
  errorMessage = '';

  constructor(
    private _themeService: ThemeService,
    private _cateoryService: CateoryService,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _router: Router
  ) {
    this.isDarkMode$ = this._themeService.isDarkMode$;
    this._activatedRoute.params.subscribe(params => {
      this.categoryId = params['id'];
      setTimeout(() => {
        this.getCategoryDetails();
        this.getAllCategories();
        this.getProducts();
      }, 100);
    });
  }

  ngOnInit() {
    this.initlizeAddProduct();
  }

  initlizeAddProduct() {
    this.addProductForm = this.fb.group({
      name: [''],
      watt: [''],
      lumen: [''],
      description: [''],
      category: [this.categoryId],
      image: ['']
    });
  }

  getAllCategories() {
    this._cateoryService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data;
      }, 
      error: (err) => {
        this.errorVisible = true;
        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  getProducts() {
    let params = { category: this.categoryId };
    this._cateoryService.getProducts(this.categoryId, params).subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorVisible = true;
        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.showAddModelDialog = false;
    this.showModelQrCodesDialog = false;
    this.resetForm();
  }

  showAddModelDialogHandler() {
    this.showAddModelDialog = true;
  }

  showModelQrCodesHandler() {
    this.showModelQrCodesDialog = true;
  }

  getCategoryDetails() {
    this._cateoryService.getCategoryById(this.categoryId).subscribe({
      next: (res: any) => {
        this.categoryDetails = res.data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorVisible = true;
        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  addNewProduct() {
    this.isAddingProduct = true;
    const formData = new FormData();
    formData.append('name', this.addProductForm.value.name);
    formData.append('watt', this.addProductForm.value.watt);
    formData.append('lumen', this.addProductForm.value.lumen);
    formData.append('description', this.addProductForm.value.description);
    formData.append('category', this.addProductForm.value.category);
    formData.append('image', this.addProductForm.value.image);

    this._cateoryService.addNewProduct(formData).subscribe({
      next: (res: any) => {
        this.hideDialog();
        this.getProducts();
        this.resetForm();
        this.isAddingProduct = false;
      },
      error: (err: any) => {
        this.isAddingProduct = false;
        this.errorVisible = true;
        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm() {
    this.addProductForm.reset();
    this.imagePreview = null;
  }

  createModel() {
    this.isCreatingModel = true;
    let payload = {
      name: this.name,
      product: this.selectedProduct._id,
      quantity: this.quantity
    };

    this._cateoryService.createModel(payload).subscribe({
      next: (res: any) => {
        this.hideDialog();
        this.isCreatingModel = false;
        this.isCreatingQrCodes = false;
        this.qrCodes = res.data.qrCodes.map(qr => ({
          ...qr,
          fullUrl: `${window.location.origin}/activate-warranty/${qr.code}`
        }));
        this.codes = res.data.qrCodes.map(qr => qr.code);
        this.getProducts();
        this.showModelQrCodesHandler();
      },
      error: () => (this.isCreatingModel = false)
    });
  }

  printQrCodes() {
    let payload = {
      qrCodes: this.codes
    }
    this.isPrinting = true;
    this._cateoryService.printQrCodes(payload).subscribe({
      next: () => {
        this.isPrinting = false;
        this.cdr.detectChanges();
        const printContent = `
        <html>
          <head>
            <title>OKLAND Warranty QR Codes</title>
            <style>
              @font-face {
                font-family: "Azonix";
                src: url(/assets/fonts/Azonix.otf) format("opentype");
              }
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                font-family: 'Arial', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                padding: 10px;
              }
              .card {
                border: 2px solid #000;
                border-radius: 12px;
                padding: 12px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                gap: 24px;
                align-items: center;
                box-sizing: border-box;
              }
              .info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 6px;
                font-size: 12px;
                color: #000;
              }
              .strong {
                background-color: #000;
                color: #fff;
                border-radius: 3px;
                padding: 2px 6px;
                display: inline-block;
                margin-bottom: 2px;
                font-size: 11px;
              }
              .desc {
                color: #000;
                background-color: #fff;
                border: 1px solid #000;
                border-radius: 3px;
                padding: 2px 6px;
                display: inline-block;
                margin-bottom: 2px;
                font-size: 11px;
              }
              .qr {
                width: 90px;
                height: 90px;
                border: 3px solid #000;
                border-radius: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
              }
              .qr img {
                width: 85px;
                height: 85px;
              }
              .title {
                font-weight: bold;
                font-size: 14px;
                margin-top: 4px;
              }
              .activate {
                font-weight: bold;
                text-align: center;
                font-size: 12px;
                margin-top: 4px;
              }
              .arabic {
                font-weight: bold;
                text-align: center;
                font-size: 13px;
              }
              .title {
                font-family: 'Azonix', sans-serif;
              }
              .flex-column {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
              }
              .logo {
                display: flex;
                gap: 6px;
                font-size: 16px;
                font-weight: bold;
              }
              .logo img {
                width: 40px;
                height: 50px;
              }
              .okland {
                margin-top: 8px;
                width: 60px !important;
                height: 15px !important;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body>
            ${this.qrCodes.map(qr => `
              <div class="card">
                <div class="info">
                  <div class="logo">
                    <img src="/assets/img/lion.png" alt="Logo">
                    <div class="flex-column">
                      <img src="/assets/img/Okland Typography (Orange).png" alt="Logo" class="okland">
                      <h4 class="title">
                        WARRANTY
                      </h4>
                    </div>
                  </div>
                  <div class="strong"><strong>Product:</strong> ${this.selectedProduct.name}</div>
                  <div class="strong"><strong>Model:</strong> ${this.name}</div>
                  <div class="desc"><strong>Power:</strong> ${this.selectedProduct.watt}W</div>
                  <div class="desc"><strong>Lumen:</strong> ${this.selectedProduct.lumen}LM</div>
                  <div class="activate">Activate your Warranty</div>
                  <div class="arabic">تفعيل الضمان</div>
                </div>
                <div class="qr">
                  <img src="${qr.qrCodeImage}" alt="QR Code">
                </div>
              </div>
            `).join('')}
          </body>
        </html>
        `;

        const printWindow = window.open('', '_blank', 'width=900,height=650');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        }
      },
      error: (err: any) => {
        this.isPrinting = false;
        this.errorVisible = true;
        this.errorMessage = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  navigateToProductDetails(product) {
    this._router.navigate(['/products/edit', product._id]);
  }

  onBasicUploadAuto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview = base64String;
        this.addProductForm.patchValue({ image: base64String });
        this.addProductForm.get('image')!.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }
}
