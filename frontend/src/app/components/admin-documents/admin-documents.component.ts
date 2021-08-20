import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service'
import { Document } from 'src/app/models/interfaces'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/app/shared/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocService } from 'src/app/shared/doc.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DocsDetailComponent } from '../docs-detail/docs-detail.component';


@Component({
  selector: 'app-admin-documents',
  templateUrl: './admin-documents.component.html',
  styleUrls: ['./admin-documents.component.scss']
})
export class AdminDocumentsComponent implements AfterViewInit {


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
  public pruebaDocs: Document[];
  public selectedDocument: Document;
  public documentsFiltered: Document[] = [];
  displayedColumns: string[] = ['identifier', 'title', 'source', 'edit', 'delete'];
  dataSource: MatTableDataSource<Document>;

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }


  TypeOfDocs = [
    { id: 'article', name: 'Article' },
    { id: 'clinical trial', name: 'Clinical Trial' },
    { id: 'patents', name: 'Patent' }
  ];

  SourceOfDocs = [
    { id: '', name: 'ALL' },
    { id: 'LILACS', name: 'LILACS' },
    { id: 'IBECS', name: 'IBECS' },
    { id: 'INDEXPSI', name: 'INDEXPSI' },
    { id: 'reec', name: 'REEC' },
    { id: 'Google Patents', name: 'GOOGLE P' }
  ];


  constructor(
    private api: ApiService,
    public auth: AuthService,
    private dialog: MatDialog,
    public service: DocService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {

    this.dataSource = new MatTableDataSource([]);
    this.getDocumets();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {

  }




  getDocumets(): void {
    this.loading = true;
    this.api.getDocuments().subscribe(
      response => {
        this.dataSource = new MatTableDataSource(response['items']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      },
      error => console.log(error),
      () => {
        this.loading = false;
        Object.assign(this.documentsFiltered, this.documents);
      }
    )


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getRecord(event: Event) {

    console.log(event);

  }

  deleteDoc(row) {

    //User answer from the dialog confirm.
    let answer = false;
    let message = "Are you sure you want to delete " + row['identifier'];
    this.dialogService.openConfirmDialog(message).afterClosed().subscribe(res => {
      answer = res
    },
      error => { },
      () => {
        if (answer) {

          let index = this.dataSource.data.indexOf(row);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();

          // Emulate term removal.
          const snackBarRef = this.snackBar.open('Term deleted.', 'Undo')

          // If the action button of snackbar is clicked, the term is not removed.
          snackBarRef.onAction().subscribe(() => {
            this.dataSource.data.splice(index, 0, row);
            this.dataSource._updateChangeSubscription();
            this.snackBar.open('Term was not deleted.', 'OK', { duration: 5000 })
          })

          // Otherwise, if the the the snackbar is closed by timeout, the term is sent to the backend to be deleted.
          snackBarRef.afterDismissed().subscribe(info => {
            if (!info.dismissedByAction) {
              this.api.removeTerm(row).subscribe()
            }
          })

        }
      },


    );

  }

  editDoc(row: Document) {

    console.log("edit");
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";

    const dialogRef = this.dialog.open(DocsDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        console.log(data);
        if (data['_id']) {
          let index = this.indexOfFunc(this.dataSource.data, "_id", data['_id'])
          this.dataSource.data.splice(index, 1, data);
          this.dataSource._updateChangeSubscription();
        }
      }
    );



  }

  indexOfFunc(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  }



}
