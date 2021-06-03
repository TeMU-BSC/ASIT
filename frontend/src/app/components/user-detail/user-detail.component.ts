import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { TermsComponent } from 'src/app/components/terms/terms.component'
import { DialogComponent } from 'src/app/components/dialog/dialog.component'
import { FormConfig } from 'src/app/models/interfaces'
import { ApiService } from 'src/app/services/api.service'
import { AuthService } from 'src/app/services/auth.service'
import { User } from 'src/app/models/interfaces'
import {MatDialogRef} from '@angular/material/dialog'
import {UserService} from './../../shared/user.service'
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;

  user_role= "";
  docIdentifiers = [];
  constructor(public service: UserService, public dialogRef: MatDialogRef<UserDetailComponent>){
  }

  roles = [
    {id: "annotator", value: "annotator"},
    {id: "validator", value: "validator"},
    {id: "admin", value: "admin"}
  ]

  ngOnInit() {
      this.changeUser_role();
   }


   changeUser_role(){
    console.log("cambio")
    if(this.service.form['value']['role']){
      this.user_role = "annotator";
    }else{
      this.user_role = "admin"
    }

   }



   onClose(){
    this.service.form.reset();
    this.dialogRef.close();
   }
   onEdit(){

   }

   onClear(){
     this.service.form.reset();
     this.service.InitializeFormGroup();
   }

   onSubmit(){
     if(this.service.form.valid){
       this.service.form.reset();
       this.service.InitializeFormGroup();
     }
   }


}
