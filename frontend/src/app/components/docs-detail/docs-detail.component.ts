import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Document } from 'src/app/models/interfaces'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { MatDialogRef } from '@angular/material/dialog'
import { DocService } from 'src/app/shared/doc.service'

@Component({
  selector: 'app-docs-detail',
  templateUrl: './docs-detail.component.html',
  styleUrls: ['./docs-detail.component.scss']
})
export class DocsDetailComponent implements OnInit {

  @Input() doc: Document;
  constructor(public service: DocService,
    public dialogRef: MatDialogRef<DocsDetailComponent>,
    public api: ApiService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  onClose(data) {
    this.service.InitializeFormGroup();
    this.service.doc_form.reset();
    this.dialogRef.close(data);
  }

  submitData() {
    let id = this.service.doc_form['value']['_id']

    let updatedDoc: Document;
    updatedDoc = {
      identifier: this.service.doc_form['value']['identifier'],
      title: this.service.doc_form['value']['title'],
      abstract: this.service.doc_form['value']['abstract'],
      year: this.service.doc_form['value']['year'],
      source: this.service.doc_form['value']['source'],
      type: this.service.doc_form['value']['type'],
    }

    if (id) {
      this.api.updateDoc(updatedDoc, id).subscribe(response => {
      }, error => { },
        () => {
          this.onClose(this.service.doc_form['value']);
        })
    } else {
      this.api.addDocuments(updatedDoc).subscribe(response => {
        this.service.doc_form['value']['_id'] = response['record']['_id']
      }, error => { },
        () => {
          this.onClose(this.service.doc_form['value']);
        })

    }


  }




}
