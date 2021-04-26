import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { TermsComponent } from 'src/app/components/terms/terms.component'
import { DialogComponent } from 'src/app/components/dialog/dialog.component'
import { FormConfig } from 'src/app/models/interfaces'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { Document } from 'src/app/models/interfaces'

@Component({
  selector: 'app-doc',
  templateUrl: './doc.component.html',
  styleUrls: ['./doc.component.scss']
})
export class DocComponent implements AfterViewInit {

  @Input() doc: Document
  @Output() completed = new EventEmitter<boolean>()
  @Output() validated = new EventEmitter<boolean>()
  formConfigTerms: FormConfig = {
    label: 'Términos',
    hint: ``,
    buttonName: 'Completado',
    color: 'primary',
    action: 'complete'
  }
  formConfigValidations: FormConfig = {
    label: 'Términos',
    hint: ``,
    buttonName: 'Validado',
    color: 'accent',
    action: 'validate'
  }

  constructor(
    public api: ApiService,
    private auth: AuthService,
    public dialog: MatDialog,
  ) { }

  ngAfterViewInit() { }

    printDoc(){
      console.log(this.doc);
    }
  /**
   * Open a confirmation dialog before mark a document as completed/validated and apply changes to backend.
   */
  confirmDialogBeforeMark(action: string): void {
    let title: string
    let content: string
    let buttonName: string
    let color: string
    switch (action) {
      case 'complete':
        title = 'Esta acción no se puede revertir.'
        content = '¿Quieres marcar este documento como completado?'
        buttonName = 'Completar'
        color = 'primary'
        break
      case 'validate':
        title = 'Esta acción no se puede revertir.'
        content = '¿Quieres marcar este documento como validado?'
        buttonName = 'Validar'
        color = 'accent'
        break
    }
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      data: {
        title,
        content,
        cancel: 'Cancelar',
        buttonName,
        color
      }
    })
    dialogRef.afterClosed().subscribe(confirmation => {
      if (confirmation) {
        switch (action) {
          case 'complete':
            this.doc.completed = true
            this.completed.emit(true)
            this.api.markAsCompleted({
              document_identifier: this.doc.identifier,
              user_email: this.auth.getCurrentUser().email
            }).subscribe()
            break
          case 'validate':
            this.doc.validated = true
            this.validated.emit(true)
            this.api.markAsValidated({
              document_identifier: this.doc.identifier,
              user_email: this.auth.getCurrentUser().email
            }).subscribe()
            const validatedAnnotations = []
            this.api.saveValidatedAnnotations(validatedAnnotations).subscribe()
            break
        }
      }
    })
  }

}
