import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { TermsComponent } from 'src/app/components/terms/terms.component'
import { DialogComponent } from 'src/app/components/dialog/dialog.component'
import { FormConfig } from 'src/app/models/interfaces'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { User } from 'src/app/models/interfaces'
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements AfterViewInit {

  @Input() user: User;


   docIdentifiers = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
   }

   ngOnChange(){

   }

  printDoc(){
    console.log(this.user);
  }

}
