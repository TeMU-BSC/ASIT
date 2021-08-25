import { AfterViewInit } from '@angular/core';
import { Component, OnInit, ViewChild, EventEmitter, Input, OnChanges, Output, } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/interfaces';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})


export class UsersListComponent implements AfterViewInit {

  @Output() userChange = new EventEmitter<any>()


  constructor() { }

  ngOnInit(): void {
  }

  mock_data = [
    {
      name: "Darryl Estrada",
      email: "darryl@gmail.com",
      role: "annotator",
      document_completed: 10,
      document_total: 100,
      percentage: 10
    },
    {
      name: "Luis Gasco",
      email: "luis@gmail.com",
      role: "annotator",
      document_completed: 75,
      document_total: 100,
      percentage: 75,
    },
    {
      name: "Martin",
      email: "marting@gmail.com",
      role: "annotator",
      document_completed: 15,
      document_total: 50,
      percentage: 30
    },
    {
      name: "Erick Morgan",
      email: "erick@gmail.com",
      role: "validator",
      document_completed: 50,
      document_total: 50,
      percentage: 100,
    },
    {
      name: "Aythami Wrickett",
      email: "aythami@gmail.com",
      role: "validator",
      document_completed: 0,
      document_total: 100,
      percentage: 0
    },
    {
      name: "Olga Vales",
      email: "olga@sanidad.cat",
      role: "annotator",
      document_completed: 20,
      document_total: 36,
      percentage: 56
    },
    {
      name: "Pedro Perez",
      email: "pedro@hotmail.com",
      role: "annotator",
      document_completed: 87,
      document_total: 95,
      percentage: 92
    },
  ]


  displayedColumns = ['name', 'email', 'role', 'document_completed', 'document_total', 'percentage']
  dataSource = new MatTableDataSource(this.mock_data);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }



  getColor(item) {
    let percent = (item["document_completed"] * 100) / item["document_total"]
    if (percent == 100) {
      return "green"
    } else if (percent >= 75) {
      return "yellow"
    } else if (percent >= 50) {
      return "orange"
    }
    else if (percent >= 25) {
      return "red"
    }
    else if (percent >= 0) {
      return "black"
    }
  }
  change(row) {

    this.userChange.emit(row)
  }
}

