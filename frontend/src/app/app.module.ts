import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

// npm third-party libraries
import { FlexLayoutModule } from '@angular/flex-layout'
import { MaterialModule } from './modules/material.module'
import { SimplemattableModule } from 'simplemattable'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
// Created components, pipes, interceptors
import { AppComponent } from './app.component'
import { HeaderComponent } from './components/header/header.component'
import { FooterComponent } from './components/footer/footer.component'
import { HomeComponent } from './components/home/home.component'
import { AdminComponent } from './components/admin/admin.component'
import { LoginComponent } from './components/login/login.component'
import { DialogComponent } from './components/dialog/dialog.component'
import { DocsComponent } from './components/docs/docs.component'
import { DocComponent } from './components/doc/doc.component'
import { TermsComponent } from './components/terms/terms.component'
import { DocDetailComponent } from './components/doc-detail/doc-detail.component'
// import { HighlightPipe } from './pipes/highlight.pipe'
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AdminDocumentsComponent } from './components/admin-documents/admin-documents.component';
import { AdminTermsComponent } from './components/admin-terms/admin-terms.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { UserService } from './shared/user.service';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TermDetailComponent } from './components/term-detail/term-detail.component';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';
import { DocsDetailComponent } from './components/docs-detail/docs-detail.component';
import { UserWorkComponent } from './components/user-work/user-work.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    DialogComponent,
    DocsComponent,
    DocComponent,
    TermsComponent,
    DocDetailComponent,
    // HighlightPipe,
    SafeHtmlPipe,
    SidenavComponent,
    AdminUsersComponent,
    UserDetailComponent,
    AdminDocumentsComponent,
    AdminTermsComponent,
    TermDetailComponent,
    MatConfirmDialogComponent,
    DocsDetailComponent,
    UserWorkComponent,
    UsersListComponent,
    StatisticsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    SimplemattableModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    NgxPaginationModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [
    // HighlightPipe,
    UserService
  ],
  bootstrap: [AppComponent],
  entryComponents: [UserDetailComponent, MatConfirmDialogComponent, TermDetailComponent, DocsDetailComponent],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ]
})
export class AppModule { }
