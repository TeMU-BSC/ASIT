import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service'
import { Document } from 'src/app/models/interfaces'


@Component({
  selector: 'app-admin-documents',
  templateUrl: './admin-documents.component.html',
  styleUrls: ['./admin-documents.component.scss']
})
export class AdminDocumentsComponent implements OnInit {


  //Pagination properties
  currentPage: number;
  itemsPerPage: number;
  loading: boolean

  //Form variables
  public documents: Document[];
  public selectedDocument: Document;
  public documentsFiltered: Document[]=[];


  constructor(
    private api: ApiService,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.itemsPerPage=10;
    this.currentPage=1;
    this.getDocumets();

  }


  getDocumets(): void{
    this.loading = true;
    this.api.getDocuments().subscribe(
      response =>{
        this.documents = response['items'];
      },
      error => console.log(error),
      () => {this.loading = false;
      Object.assign(this.documentsFiltered, this.documents)}
    )


  }

  onSelect(document: Document): void {
    this.selectedDocument = document;
  }

}
