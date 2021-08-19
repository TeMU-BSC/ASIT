import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { PageEvent } from '@angular/material/paginator'
import { TableColumn, Width } from 'simplemattable'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { Document } from 'src/app/models/interfaces'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements AfterViewInit {

  //Pagination properties
  currentPage: number;
  itemsPerPage: number;
  selectedDoc: Document
  loading: boolean
  displayedColumns: string[] = ['identifier', 'title', 'type', 'source', 'completed'];
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



  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {


    this.dataSource = new MatTableDataSource([]);
    this.refresh();
  }
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngAfterViewInit() { }



  refresh(event?: PageEvent) {
    this.loading = true
    this.api.getAssignedDocs({
      userEmail: this.auth.getCurrentUser().email
    }).subscribe(
      response => {
        this.dataSource = new MatTableDataSource(response['documents']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => console.error(error),
      () => this.loading = false
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onSelect(row: Document) {
    this.selectedDoc = row
  }

  downloadData() {



  }

}
