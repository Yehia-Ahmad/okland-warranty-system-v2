import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, EventEmitter, inject, Injector, Input, OnInit, Output, runInInjectionContext, signal, SimpleChanges } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { CateoryService } from '../../category/services/cateory.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogoutComponent } from "../../assets/logout/logout.component";
import { WarnComponent } from "../../assets/warn/warn.component";
import { LanguageService } from '../../shared/services/translation.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../shared/services/theme.service';

export type MenuItem = {
  label: string;
  icon: SafeHtml;
  route?: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatListModule, RouterModule, DialogModule, ButtonModule, InputTextModule, TextareaModule, LogoutComponent, WarnComponent, TranslatePipe],
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.scss'
})
export class CustomSidenavComponent implements OnInit {
  private _injector = inject(Injector);
  private _languageService = inject(LanguageService);
  isSidenavCollapsed = true;
  @Output() collapsedSidenav = new EventEmitter<boolean>();
  menuItems = signal<MenuItem[]>([]);
  expandedCategory: string | null = null;
  categories: any[] = [];
  visible: boolean = false;
  isSaving: boolean = false;
  logoutVisible: boolean = false;
  addCategory: FormGroup;
  isDarkMode$;
  constructor(private _themeService: ThemeService, private sanitizer: DomSanitizer, private _cateoryService: CateoryService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private _router: Router) {
    this.initalizeAddCategory();
    this.isDarkMode$ = this._themeService.isDarkMode$;
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.buildMenuItems();
    runInInjectionContext(this._injector, () => {
      effect(() => {
        const lang = this._languageService.selectedLanguage();
        this.buildMenuItems();
      });
    });
  }

  initalizeAddCategory() {
    this.addCategory = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required]
    })
  }

  private sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getAllCategories() {
    this.categories = [];
    this._cateoryService.getCategories().subscribe((res: any) => {
      res.data.map((category: any) => {
        this.categories.push({ label: category.name, route: `/categories/${category._id}` })     
      });
      this.buildMenuItems();
    })
  }

  buildMenuItems() {
    this.menuItems.set([
      {
        label: 'sidebarTitles.admins',
        icon: this.sanitize(`
        <span class="block w-8 h-8">
            <svg width="100%" height="100%" viewBox="0 0 31 26" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
                style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                <path
                    d="M3.719,4.996c-0,-1.472 1.211,-2.683 2.683,-2.683c1.471,-0 2.682,1.211 2.682,2.683c0,1.472 -1.211,2.683 -2.682,2.683c-1.472,-0 -2.683,-1.211 -2.683,-2.683Zm-0.384,7.555c-0.479,0.537 -0.766,1.251 -0.766,2.027c-0,0.776 0.287,1.49 0.766,2.026l0,-4.053Zm6.918,-2.362c-1.422,1.26 -2.318,3.105 -2.318,5.155c-0,1.644 0.575,3.153 1.533,4.336l-0,1.03c-0,0.848 -0.685,1.533 -1.533,1.533l-3.067,0c-0.848,0 -1.533,-0.685 -1.533,-1.533l0,-1.284c-1.811,-0.862 -3.066,-2.707 -3.066,-4.848c0,-2.966 2.4,-5.366 5.366,-5.366l1.533,-0c1.15,-0 2.213,0.359 3.085,0.972l0,0.005Zm11.48,10.521l-0,-1.03c0.958,-1.183 1.533,-2.692 1.533,-4.336c-0,-2.05 -0.896,-3.895 -2.319,-5.16c0.872,-0.613 1.935,-0.972 3.085,-0.972l1.533,-0c2.966,-0 5.366,2.4 5.366,5.366c0,2.141 -1.255,3.986 -3.066,4.848l-0,1.284c-0,0.848 -0.685,1.533 -1.533,1.533l-3.066,0c-0.848,0 -1.533,-0.685 -1.533,-1.533Zm0.383,-15.714c-0,-1.472 1.211,-2.683 2.683,-2.683c1.472,-0 2.683,1.211 2.683,2.683c-0,1.472 -1.211,2.683 -2.683,2.683c-1.472,-0 -2.683,-1.211 -2.683,-2.683Zm5.749,7.555l-0,4.058c0.479,-0.541 0.766,-1.25 0.766,-2.027c0,-0.776 -0.287,-1.49 -0.766,-2.026l-0,-0.005Zm-12.265,-10.238c1.682,-0 3.066,1.384 3.066,3.066c0,1.682 -1.384,3.066 -3.066,3.066c-1.682,0 -3.066,-1.384 -3.066,-3.066c-0,-1.682 1.384,-3.066 3.066,-3.066Zm-3.833,13.031c0,0.776 0.288,1.485 0.767,2.027l-0,-4.053c-0.479,0.541 -0.767,1.25 -0.767,2.026Zm6.899,-2.026l0,4.058c0.479,-0.542 0.767,-1.251 0.767,-2.027c-0,-0.776 -0.288,-1.49 -0.767,-2.027l0,-0.004Zm3.067,2.026c-0,2.142 -1.256,3.986 -3.067,4.849l0,2.05c0,0.848 -0.685,1.533 -1.533,1.533l-3.066,0c-0.848,0 -1.533,-0.685 -1.533,-1.533l-0,-2.05c-1.811,-0.863 -3.066,-2.707 -3.066,-4.849c-0,-2.965 2.4,-5.366 5.366,-5.366l1.533,0c2.965,0 5.366,2.401 5.366,5.366Z"
                    style="fill:#2f2f2f;fill-rule:nonzero;" />
            </svg>
        </span>
        `),
        route: '/admins'
      },
      {
        label: 'sidebarTitles.categories',
        icon: this.sanitize(`
        <span class="block w-8 h-8">
            <svg width="100%" height="100%" viewBox="0 0 31 28" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
                style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                <path
                    d="M14.349,0.699c0.793,-0.367 1.709,-0.367 2.502,-0l11.637,5.376c0.452,0.208 0.74,0.661 0.74,1.161c-0,0.5 -0.288,0.953 -0.74,1.16l-11.637,5.377c-0.793,0.367 -1.709,0.367 -2.502,-0l-11.637,-5.377c-0.452,-0.213 -0.739,-0.665 -0.739,-1.16c-0,-0.495 0.287,-0.953 0.739,-1.161l11.637,-5.376Zm11.307,10.881l2.832,1.309c0.452,0.208 0.74,0.66 0.74,1.161c-0,0.5 -0.288,0.953 -0.74,1.16l-11.637,5.377c-0.793,0.367 -1.709,0.367 -2.502,-0l-11.637,-5.377c-0.452,-0.213 -0.739,-0.665 -0.739,-1.16c-0,-0.495 0.287,-0.953 0.739,-1.161l2.832,-1.309l8.092,3.737c1.245,0.575 2.683,0.575 3.928,-0l8.092,-3.737Zm-8.092,10.55l8.092,-3.737l2.832,1.31c0.452,0.208 0.74,0.66 0.74,1.16c-0,0.501 -0.288,0.953 -0.74,1.161l-11.637,5.376c-0.793,0.368 -1.709,0.368 -2.502,0l-11.637,-5.376c-0.452,-0.213 -0.739,-0.665 -0.739,-1.161c-0,-0.495 0.287,-0.952 0.739,-1.16l2.832,-1.31l8.092,3.737c1.245,0.575 2.683,0.575 3.928,0Z"
                    style="fill:#2f2f2f;fill-rule:nonzero;" />
            </svg>
        </span>
        `),
        children: this.categories,
      },
      {
        label: 'sidebarTitles.warranties',
        icon: this.sanitize(`
        <span class="block w-8 h-8">
            <svg width="100%" height="100%" viewBox="0 0 28 34" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
                style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                <path
                    d="M0.999,0.994c0.602,-0.247 1.31,-0.158 1.813,0.228l2.86,2.189l2.86,-2.189c0.637,-0.487 1.578,-0.487 2.208,-0l2.86,2.189l2.86,-2.189c0.637,-0.487 1.579,-0.487 2.209,-0l2.86,2.189l2.86,-2.189c0.502,-0.386 1.21,-0.475 1.812,-0.228c0.601,0.247 0.991,0.785 0.991,1.38l-0,29.362c-0,0.595 -0.39,1.133 -0.991,1.379c-0.602,0.247 -1.31,0.159 -1.812,-0.227l-2.86,-2.19l-2.86,2.19c-0.637,0.487 -1.579,0.487 -2.209,-0l-2.86,-2.19l-2.86,2.19c-0.637,0.487 -1.578,0.487 -2.208,-0l-2.86,-2.19l-2.86,2.19c-0.503,0.386 -1.211,0.474 -1.813,0.227c-0.601,-0.246 -0.991,-0.784 -0.991,-1.379l0,-29.362c0,-0.595 0.39,-1.133 0.991,-1.38Zm5.805,8.973c-0.623,0 -1.132,0.456 -1.132,1.013c-0,0.557 0.509,1.012 1.132,1.012l13.592,0c0.623,0 1.133,-0.455 1.133,-1.012c-0,-0.557 -0.51,-1.013 -1.133,-1.013l-13.592,0Zm-1.132,13.163c-0,0.557 0.509,1.012 1.132,1.012l13.592,0c0.623,0 1.133,-0.455 1.133,-1.012c-0,-0.557 -0.51,-1.013 -1.133,-1.013l-13.592,0c-0.623,0 -1.132,0.456 -1.132,1.013Zm1.132,-7.088c-0.623,0 -1.132,0.456 -1.132,1.013c-0,0.557 0.509,1.012 1.132,1.012l13.592,0c0.623,0 1.133,-0.455 1.133,-1.012c-0,-0.557 -0.51,-1.013 -1.133,-1.013l-13.592,0Z"
                    style="fill:#2f2f2f;fill-rule:nonzero;" />
            </svg>
        </span>
        `),
        route: '/warranties'
      }
    ])
  }

  toggleCategory(category: string) {
    if (this.isSidenavCollapsed) {
      this.openSidenav();
      // Wait a bit to allow sidenav to expand smoothly before showing children
      setTimeout(() => {
        this.expandedCategory = category;
      }, 300); // adjust delay to match your sidenav animation time
    } else {
      this.expandedCategory = this.expandedCategory === category ? null : category;
    }
  }


  openSidenav() {
    this.isSidenavCollapsed = false
    this.collapsedSidenav.emit(this.isSidenavCollapsed);
  }

  openDialog(): void {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
  }

  addNewCategory() {
    if (this.addCategory.invalid || this.isSaving) return;

    this.isSaving = true;
    const payload = this.addCategory.value;

    this._cateoryService.createCategory(payload).subscribe({
      next: (res: any) => {
        this.getAllCategories();
        this.closeDialog();
        this.addCategory.reset();
        this.isSaving = false;
      },
      error: (err) => {
        console.error(err);
        this.isSaving = false;
      }
    });
  }


  openLogoutDialog() {
    this.logoutVisible = true;
  }

  closeLogoutDialog() {
    this.logoutVisible = false;
  }

  confirmLogout() {
    this.logoutVisible = false;
    localStorage.removeItem('access_token');
    this._router.navigate(['/login']);
  }
}
