import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Document } from 'src/app/models/interfaces'
import { ApiService } from 'src/app/services/api.service'

@Component({
  selector: 'app-doc-detail',
  templateUrl: './doc-detail.component.html',
  styleUrls: ['./doc-detail.component.scss']
})
export class DocDetailComponent implements OnInit {

  doc$: Observable<Document>

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.doc$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.api.getDoc(params.get("id")))
    )
  }

}
