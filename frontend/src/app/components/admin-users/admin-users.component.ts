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

  }

  refresh(event?: PageEvent) {
    this.loading = true
    this.api.getUsers().subscribe(
      response => {
       this.users = response
      },
      error => console.error(error),
      () => this.loading = false
    )
  }

}
