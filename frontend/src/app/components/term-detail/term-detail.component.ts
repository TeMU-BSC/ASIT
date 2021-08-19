import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { TermsComponent } from 'src/app/components/terms/terms.component'
import { DialogComponent } from 'src/app/components/dialog/dialog.component'
import { FormConfig } from 'src/app/models/interfaces'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { Term } from 'src/app/models/interfaces'
import { MatDialogRef } from '@angular/material/dialog'
import { UserService } from './../../shared/user.service'
import { TermService } from 'src/app/shared/term.service'

@Component({
  selector: 'app-term-detail',
  templateUrl: './term-detail.component.html',
  styleUrls: ['./term-detail.component.scss']
})
export class TermDetailComponent implements OnInit {

  @Input() term: Term;

  constructor(public service: TermService,
    public dialogRef: MatDialogRef<TermDetailComponent>,
    public api: ApiService,
    public auth: AuthService) { }

  ngOnInit(): void {
  }

  onClose(data) {
    this.service.InitializeFormGroup();
    this.service.term_form.reset();
    this.dialogRef.close(data);
  }

  submitData() {
    let id = this.service.term_form['value']['_id']
    this.service.term_form['value']['synonyms'] = typeof this.service.term_form['value']['synonyms'] !== "object" ? this.service.term_form['value']['synonyms'].split("\n") : [];

    let updatedTerm: Term;
    updatedTerm = {
      code: this.service.term_form['value']['code'],
      description: this.service.term_form['value']['description'],
      name: this.service.term_form['value']['name'],
      terminology: this.service.term_form['value']['terminology'],
      synonyms: this.service.term_form['value']['synonyms'],
    }

    if (id) {
      this.api.updateTerm(updatedTerm, id).subscribe(response => {
      }, error => { },
        () => {
          this.onClose(this.service.term_form['value']);
        })
    } else {
      this.api.addTerms(updatedTerm).subscribe(response => {
        this.service.term_form['value']['_id'] = response['record']['_id']
      }, error => { },
        () => {
          this.onClose(this.service.term_form['value']);
        })

    }


  }




}
