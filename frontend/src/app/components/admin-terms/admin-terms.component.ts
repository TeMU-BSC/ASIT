import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator'
import { TableColumn, Width } from 'simplemattable'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { Term } from 'src/app/models/interfaces'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserDetailComponent } from "./../user-detail/user-detail.component"
import { MatSnackBar } from '@angular/material/snack-bar'
import { ChangeDetectionStrategy } from '@angular/core';
import { TermService } from 'src/app/shared/term.service';
import { TermDetailComponent } from '../term-detail/term-detail.component';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-admin-terms',
  templateUrl: './admin-terms.component.html',
  styleUrls: ['./admin-terms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminTermsComponent implements AfterViewInit {

  columns = []
  terms: Term[] = []
  selectedTerm: Term
  loading: boolean
  paginatorLength: number
  addNewUser: boolean = false;

  displayedColumns: string[] = ['code', 'name', 'terminology', 'edit', 'delete'];
  dataSource: MatTableDataSource<Term>;


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
    public auth: AuthService,
    private dialog: MatDialog,
    public service: TermService,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.refresh();
    this.loading = false;
  }
  ngAfterViewInit(): void {



  }



  refresh(event?: PageEvent) {

    setTimeout(() => {
      this.api.getTerms().subscribe(
        response => {
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error => console.error(error),
        () => this.loading = false

      )
    });



  }

  selectTerm(row: Term) {
    this.selectedTerm = row
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addTerm() {
    this.service.InitializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    const dialogRef = this.dialog.open(TermDetailComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        if (data['_id']) {
          let index = this.indexOfFunc(this.dataSource.data, "_id", data['_id'])
          this.dataSource.data.push(data)
          this.dataSource._updateChangeSubscription();
        }
      }
    );
  }
  editTerm(row: Term) {
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";

    const dialogRef = this.dialog.open(TermDetailComponent, dialogConfig);
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


  deleteTerm(row: Term) {

    //User answer from the dialog confirm.
    let answer = false;
    let message = "Are you sure you want to delete " + row['name'];
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


}
