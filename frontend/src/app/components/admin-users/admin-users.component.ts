import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator'
import { TableColumn, Width } from 'simplemattable'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { User } from 'src/app/models/interfaces'

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  columns = []
  users: User[] = []
  selectedUser: User
  loading: boolean
  paginatorLength: number
  addNewUser: boolean = false;


  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {

    this.columns = [
      new TableColumn<User, 'email'>('Email', 'email')
        .withColFilter().withColFilterLabel('Filtrar'),
      new TableColumn<User, 'fullname'>('Name', 'fullname')
        .isHiddenXs(true)
        .withWidth(Width.pct(75))
        .withColFilter().withColFilterLabel('Filtrar'),
      new TableColumn<User, 'role'>('Role', 'role')
        .isHiddenXs(true)
        .withWidth(Width.pct(75))
        .withColFilter().withColFilterLabel('Filtrar'),
    ]
  }

  ngOnInit(): void {
    this.refresh()
  }

  refresh(event?: PageEvent) {
    this.loading = true
    this.api.getUsers({
      pageSize: event?.pageSize,
      pageIndex: event?.pageIndex,
    }).subscribe(
      response => {
       this.users = response['items']
       this.paginatorLength = response['total_items_count']
      },
      error => console.error(error),
      () => this.loading = false
    )
  }

  selectUser(row: User) {
    this.selectedUser = row
  }

  public toggle(){
    this.addNewUser = true;
    console.log(this.addNewUser);
  }

}
