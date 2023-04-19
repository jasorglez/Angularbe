import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes
import { MainPageComponent } from './main-page/main-page.component';
import { Error404Component } from './main-page/error404/error404.component';

import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  { path: 'login',  loadChildren: () => import('./login/login.module').then(m=>m.LoginModule)},
  { path: '',
    component: MainPageComponent, canActivate: [AuthGuard],
    children: [
      { path: '', loadChildren: () => import('./main-page/home/home.module').then(m=>m.HomeModule)},
      { path: 'branchs', loadChildren: () => import('./main-page/branchs/branchs.module').then(m=>m.BranchsModule)},
      { path: 'users', loadChildren: () => import('./main-page/users/users.module').then( m=> m.UsersModule)},
      { path: '**', component: Error404Component}
    ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }


