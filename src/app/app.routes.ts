import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'login',
        loadComponent: () => import('./modules/login/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/layout/components/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'admins',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/admin/components/admins/admins.component').then(m => m.AdminsComponent)
    },
    {
        path: 'categories/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/category/components/category-details/category-details.component').then(m => m.CategoryDetailsComponent)
    },
    {
        path: 'products/edit/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/category/components/product-edit/product-edit.component').then(m => m.ProductEditComponent)
    },
    {
        path: 'warranties',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/warranty/components/warranties/warranties.component').then(m => m.WarrantiesComponent)
    },
    {
        path: 'activate-warranty/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/warranty/components/activate-warranty/activate-warranty.component').then(m => m.ActivateWarrantyComponent)
    },
    {
        path: 'warranty-details/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/warranty/components/warranty-details/warranty-details.component').then(m => m.WarrantyDetailsComponent)
    },
    {
        path: '**',
        canActivate: [authGuard],
        loadComponent: () => import('./modules/layout/components/home/home.component').then(m => m.HomeComponent)
    },
];
