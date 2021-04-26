import { NgModule } from '@angular/core'

// Import the NgModule for each component you want to use:
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatChipsModule } from '@angular/material/chips'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatMenuModule } from '@angular/material/menu'
import { MatSelectModule } from '@angular/material/select'
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'
import { MatTabsModule } from '@angular/material/tabs'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MaterialFileInputModule } from 'ngx-material-file-input'

const material = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatTableModule,
  MatChipsModule,
  MatTabsModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatMenuModule,
  MaterialFileInputModule,
]

@NgModule({
  declarations: [
  ],
  imports: material,
  exports: material,
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } }
  ],
  bootstrap: []
})
export class MaterialModule { }
