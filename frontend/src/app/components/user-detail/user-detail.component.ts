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



   print(event){
     this.user_role = event['value'];
   }
   changeUser_role(){
      this.user_role = this.service.admin_form['value']['role'];
   }



   onClose(){
    this.service.admin_form.reset();
    this.dialogRef.close();
   }
   onEdit(){

   }

   onClear(){
     this.service.admin_form.reset();
     this.service.InitializeFormGroup();
     this.service.admin_form.reset();
   }

   onSubmit(){
     if(this.service.admin_form.valid){
       this.service.admin_form.reset();
       this.service.InitializeFormGroup();
     }
   }
   submitData(){
    console.log(this.service.admin_form['value'])

   }


}
