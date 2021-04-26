import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomeComponent } from './components/home/home.component'
import { AdminComponent } from './components/admin/admin.component'
import { DocsComponent } from './components/docs/docs.component'
import { AuthService } from './services/auth.service'
import { AuthAdminService } from './services/auth-admin.service'
import { DocDetailComponent } from './components/doc-detail/doc-detail.component'
import { LoginComponent } from './components/login/login.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  // { path: 'admin', component: AdminComponent, canActivate: [AuthService, AuthAdminService] },
  { path: 'login', component: LoginComponent },
  { path: 'docs', component: DocsComponent, canActivate: [AuthService] },
  { path: 'doc/:id', component: DocDetailComponent, canActivate: [AuthService] },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
