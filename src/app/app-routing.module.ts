import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home/home.component';
import { LoginComponent } from './modules/auth/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/auth/pages/register/register.component';
import { AuthGuard } from './core/guards/auth/auth.guard';
// import { loginGuard } from './core/guards/login/login.guard';

const routes: Routes = [
  {
    path:'home',
    // loadChildren:()=> import('./modules/home/home/home.module').then(m => m.HomeModule),
    component:HomeComponent,
    canActivate:[AuthGuard]

  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'signup',
    component:RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
