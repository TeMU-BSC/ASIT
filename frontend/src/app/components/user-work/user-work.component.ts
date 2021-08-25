import { Input, OnChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-work',
  templateUrl: './user-work.component.html',
  styleUrls: ['./user-work.component.scss']
})
export class UserWorkComponent implements OnChanges {

  constructor() { }
  @Input() selectedUser;
  ngOnInit(): void {
  }
  user: any;


  ngOnChanges() {
    this.user = this.selectedUser.name;
    console.log(this.selectedUser)
  }

}
