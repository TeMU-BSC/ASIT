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
  idFilter: String;
  abstractFilter: String;
  titleFilter: String;
  typeFilter: String;
  sourceFilter: String;
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


  filter(){
    this.documentsFiltered = this.documents.
      filter(document => {
        let idValid: boolean = false;
        let abstractValid: boolean = false;
        let titleValid: boolean = false;
        let typeValid: boolean = false;
        let sourceValid: boolean = false;



        // IndexOf: Returns the position of the
        // first occurrence of a substring.
        // Otherwise returns -1
        if(this.idFilter && this.idFilter!=""){
          if(document.identifier.toLowerCase().indexOf
          (this.idFilter.toLowerCase())!=-1){
            idValid=true;
          }
        }else{
          idValid=true;
        }

        // IndexOf: Returns the position of the
        // first occurrence of a substring.
        // Otherwise returns -1
        if(this.abstractFilter && this.abstractFilter!=""){
          if(document.abstract.toLowerCase().indexOf
          (this.abstractFilter.toLowerCase())!=-1){
            abstractValid=true;
          }
        }else{
          abstractValid=true;
        }

          // IndexOf: Returns the position of the
        // first occurrence of a substring.
        // Otherwise returns -1
        if(this.titleFilter && this.titleFilter!=""){
          if(document.title.toLowerCase().indexOf
          (this.titleFilter.toLowerCase())!=-1){
            titleValid=true;
          }
        }else{
          titleValid=true;
        }

          // IndexOf: Returns the position of the
        // first occurrence of a substring.
        // Otherwise returns -1
        if(this.typeFilter && this.typeFilter!=""){
          if(document.type.toLowerCase().indexOf
          (this.typeFilter.toLowerCase())!=-1){
            typeValid=true;
          }
        }else{
          typeValid=true;
        }

          // IndexOf: Returns the position of the
        // first occurrence of a substring.
        // Otherwise returns -1
        if(this.sourceFilter && this.sourceFilter!=""){
          if(document.source.toLowerCase().indexOf
          (this.sourceFilter.toLowerCase())!=-1){
            sourceValid=true;
          }
        }else{
          sourceValid=true;
        }



        return idValid && abstractValid && titleValid && typeValid && sourceValid;

      })


  }



  onSelect(document: Document): void {
    this.selectedDocument = document;
  }

}
