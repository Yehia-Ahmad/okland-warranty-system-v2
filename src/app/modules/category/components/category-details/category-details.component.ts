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
      category: [''],
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
    <title>QR Codes</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
        text-align: center;
      }
      .qr-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
      }
      .qr-item {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 12px;
        text-align: center;
        width: 180px;
      }
      img {
        width: 150px;
        height: 150px;
      }
      h3 {
        margin: 10px 0 0 0;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <h1>QR Codes for ${this.selectedProduct?.name}</h1>
    <div class="qr-grid">
      ${this.qrCodes
            .map(
              (qr) => `
            <div class="qr-item">
              <img src="${qr.qrCodeImage}" alt="${qr.activationUrl}" />
              <h3>${qr.code}</h3>
            </div>
          `
            )
            .join('')}
    </div>
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
