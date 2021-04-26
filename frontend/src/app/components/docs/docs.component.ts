import { Component, OnInit } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { TableColumn, Width } from 'simplemattable'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { Document } from 'src/app/models/interfaces'


@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {

  columns = []
  docs: Document[] = []
  selectedDoc: Document
  loading: boolean
  paginatorLength: number

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {
    this.columns = [
      new TableColumn<Document, 'identifier'>('Identificador', 'identifier')
        .withColFilter().withColFilterLabel('Filtrar'),
      new TableColumn<Document, 'title'>('Título', 'title')
        .isHiddenXs(true)
        .withWidth(Width.pct(75))
        .withColFilter().withColFilterLabel('Filtrar'),
      new TableColumn<Document, 'source'>('Fuente', 'source')
        .isHiddenXs(true)
        .withWidth(Width.pct(75))
        .withColFilter().withColFilterLabel('Filtrar'),
      new TableColumn<Document, 'type'>('Tipo', 'type')
        .isHiddenXs(true)
        .withWidth(Width.pct(75))
        .withColFilter().withColFilterLabel('Filtrar'),
      new TableColumn<Document, 'completed'>('Completado', 'completed')
        .withColFilter().withColFilterLabel('Filtrar')
        .withTransform(completed => completed ? 'Sí' : 'No')
        .withNgStyle(completed => ({ color: completed ? 'green' : 'red' })),
      // new TableColumn<Document, 'validated'>('Validado', 'validated')
      //   .withColFilter().withColFilterLabel('Filtrar')
      //   .withTransform(validated => validated ? 'Sí' : 'No')
      //   .withNgStyle(validated => ({ color: validated ? 'green' : 'red' })),
    ]
  }

  ngOnInit() {
    this.refresh()
  }

  refresh(event?: PageEvent) {
    this.loading = true
    this.api.getAssignedDocs({
      userEmail: this.auth.getCurrentUser().email,
      pageSize: event?.pageSize,
      pageIndex: event?.pageIndex,
    }).subscribe(
      response => {
        this.docs = response['documents']
        this.paginatorLength = response['total_document_count']
      },
      error => console.error(error),
      () => this.loading = false
    )
  }

  selectDoc(row: Document) {
    this.selectedDoc = row
  }

}
