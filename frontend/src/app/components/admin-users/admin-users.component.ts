import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator'
import { TableColumn, Width } from 'simplemattable'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { User } from 'src/app/models/interfaces'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {UserDetailComponent} from "./../user-detail/user-detail.component"
import { UserService } from './../../shared/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements AfterViewInit {
  columns = []
  users: User[] = []
  selectedUser: User
  loading: boolean
  paginatorLength: number
  addNewUser: boolean = false;

  displayedColumns: string[] = ['name', 'email', 'role','edit','delete'];
  dataSource: MatTableDataSource<User>;


  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatPaginator)set matPaginator(mp: MatPaginator) {
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
    public service: UserService
  ) {

    this.dataSource = new MatTableDataSource([]);
    this.refresh();
  }



  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.refresh()
  }

  refresh(event?: PageEvent) {
    this.loading = true
    this.api.getUsers({
      pageSize: event?.pageSize,
      pageIndex: event?.pageIndex,
    }).subscribe(
      response => {
        this.dataSource = new MatTableDataSource(response['items']);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;


      },
      error => console.error(error),
      () => this.loading = false
    )
  }

  selectUser(row: User) {
    this.selectedUser = row
  }

  public addUser(){
    this.service.InitializeFormGroup();
    this.selectedUser = null;
    //this.addNewUser = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width= "60%";
    this.dialog.open(UserDetailComponent, dialogConfig);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(row: User){
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width= "60%";
    this.dialog.open(UserDetailComponent, dialogConfig);
  }

  deleteUser(row: User){

    this.api.removeUser(row).subscribe(
      response => {
        console.log(response)
      }
    )

  }



}
