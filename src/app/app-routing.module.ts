import { RouterModule, Routes } from '@angular/router';
import { UserEditComponent } from './components/users/user-edit/user-edit.component';
import { NgModule } from '@angular/core';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },

  {
    path: 'users',
    component: UserListComponent,
    children: [
      { path: 'create', component: UserEditComponent },
      { path: ':id/edit', component: UserEditComponent },
    ],
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
