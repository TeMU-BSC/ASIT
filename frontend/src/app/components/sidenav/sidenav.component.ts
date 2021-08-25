import { Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'
import { externalLink } from 'src/app/helpers/constants'
import { NodeWithI18n } from '@angular/compiler';
import { MatSnackBar } from '@angular/material/snack-bar'
import * as EXAMPLE_USER from 'src/assets/examples/user.json'
import * as EXAMPLE_DOCUMENT_CREATE from 'src/assets/examples/document-create.json'
import * as EXAMPLE_DOCUMENT_DELETE from 'src/assets/examples/document-delete.json'
import * as EXAMPLE_TERM from 'src/assets/examples/term.json'
import { ApiService } from 'src/app/services/api.service'
import { ApiResponse, Document, Term, User } from 'src/app/models/interfaces'


export interface Action {
  name: string
  method: any
  jsonSnippet: string
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  link = externalLink

  mobileQuery: MediaQueryList;
  dataFromFile: User[] | Term[] | Document[]
  selectedFile: File
  response: ApiResponse

  //fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  fillerNav = [
    { name: "Statistics", route: "", icon: "analytics" },
    { name: "Terms", route: "", icon: "label" },
    { name: "Docs", route: "", icon: "article" },
    { name: "Users", route: "", icon: "manage_accounts" },
    { name: "Advanced", route: "", icon: "settings" }
  ];


  projects: any[] = [
    { name: 'mesinesp2', db: 'mesinesp2' },
  ]
  actions: Action[] = [
    { name: 'Añadir documentos', method: this.insertDocs.bind(this), jsonSnippet: (EXAMPLE_DOCUMENT_CREATE as any).default },
    { name: 'Eliminar documentos', method: this.deleteDocs.bind(this), jsonSnippet: (EXAMPLE_DOCUMENT_DELETE as any).default },
    { name: 'Añadir términos', method: this.insertTerms.bind(this), jsonSnippet: (EXAMPLE_TERM as any).default },
    { name: 'Añadir usuarios', method: this.registerUsers.bind(this), jsonSnippet: (EXAMPLE_USER as any).default },
  ]

  fillerContent = ["Aca ira el admin panel"];

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public auth: AuthService, private snackBar: MatSnackBar, public api: ApiService,) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  changeContent(nav) {
    this.fillerContent = [nav]
  }
  registerUsers() {
    this.auth.registerUsers(this.dataFromFile as User[]).subscribe(
      response => this.response = response,
      error => console.error(error),
      () => {
        if (this.response.success) {
          this.snackBar.open(`Usuarios añadidos correctamente`, 'Vale')
        } else {
          this.snackBar.open(`Error: ${this.response.message}. Por favor, revisa el formato JSON del fichero.`, 'Vale')
        }
      }
    )
  }

  /**
  * Set the content of the uploaded file to the 'dataFromFile' property.
  * @param event JSON file upload
  */
  onFileSelected(event) {
    this.selectedFile = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.readAsText(this.selectedFile, 'UTF-8')
    fileReader.onloadend = () => this.dataFromFile = JSON.parse(fileReader.result as string)
    fileReader.onerror = error => console.error(error)
  }
  insertDocs() {
    this.api.addDocuments(this.dataFromFile as Document[]).subscribe(
      response => this.response = response,
      error => console.error(error),
      () => {
        if (this.response.success) {
          this.snackBar.open(`Documentos añadidos correctamente.`, 'Vale')
        } else {
          this.snackBar.open(`Error: ${this.response.message}. Por favor, revisa el formato JSON del fichero.`, 'Vale')
        }
      }
    )
  }

  insertTerms() {
    this.api.addTerms(this.dataFromFile as Term[]).subscribe(
      response => this.response = response,
      error => console.error(error),
      () => {
        if (this.response.success) {
          this.snackBar.open(`Terminos añadidos correctamente.`, 'Vale')
        } else {
          this.snackBar.open(`Error: ${this.response.message}. Por favor, revisa el formato JSON del fichero.`, 'Vale')
        }
      }
    )
  }

  deleteDocs() {
    this.api.deleteDocuments(this.dataFromFile as Document[]).subscribe(
      response => this.response = response,
      error => console.error(error),
      () => {
        if (this.response.success) {
          this.snackBar.open(`Documentos eliminados correctamente.`, 'Vale')
        } else {
          this.snackBar.open(`Error: ${this.response.message}. Por favor, revisa el formato JSON del fichero.`, 'Vale')
        }
      }
    )
  }

  shouldRun = true;

}
