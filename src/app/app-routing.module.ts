import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

/* guards */
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { UnauthenticatedGuard } from '../guards/unauthenticated.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    canActivate: [UnauthenticatedGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule),
    canActivate: [UnauthenticatedGuard]
  },
  {
    path: 'shopping-cart',
    loadChildren: () => import('./shopping-cart/shopping-cart.module').then( m => m.ShoppingCartPageModule),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: 'product-description',
    loadChildren: () => import('./product-description/product-description.module').then( m => m.ProductDescriptionPageModule),
    canActivate: [AuthenticatedGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
