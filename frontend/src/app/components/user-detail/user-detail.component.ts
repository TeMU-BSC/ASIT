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

  constructor(public service: UserService, public dialogRef: MatDialogRef<UserDetailComponent>,public api: ApiService,
    public auth: AuthService){
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
    this.service.resetAssignedUser();
    this.service.InitializeFormGroup();
    this.dialogRef.close();
   }
   onEdit(){

   }

   onClear(){
     this.service.admin_form.reset();
     this.service.resetAssignedUser();
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

    let id =  this.service.admin_form['value']['_id']

    this.service.admin_form['value']['assigned_document_identifiers'] = this.service.admin_form['value']['role'] === 'annotator' ? this.service.admin_form['value']['assigned_document_identifiers'].split("\n") : [];
    if(this.service.admin_form['value']['role'] === 'validator'){
      for (let index = 0; index < this.service.admin_form['value']['assigned_users'].length; index++) {
        this.service.admin_form['value']['assigned_users'][index]['assigned_document_identifiers'] =   this.service.admin_form['value']['assigned_users'][index]['assigned_document_identifiers'].split("\n")
      }
    }
    let updatedUser: User;
    if(this.service.admin_form['value']['role'] === 'validator'){
     updatedUser  ={

      fullname: this.service.admin_form['value']['fullname'],
      email: this.service.admin_form['value']['email'],
      role: this.service.admin_form['value']['role'],
      password: this.service.admin_form['value']['password'],
      assigned_document_identifiers: this.service.admin_form['value']['assigned_document_identifiers'],
      assigned_users: this.service.admin_form['value']['assigned_users']
      }
    }else if(this.service.admin_form['value']['role'] === 'annotator'){
      updatedUser   ={

        fullname: this.service.admin_form['value']['fullname'],
        email: this.service.admin_form['value']['email'],
        role: this.service.admin_form['value']['role'],
        password: this.service.admin_form['value']['password'],
        assigned_document_identifiers: this.service.admin_form['value']['assigned_document_identifiers'],
        }
    }else{
      updatedUser  ={

        fullname: this.service.admin_form['value']['fullname'],
        email: this.service.admin_form['value']['email'],
        role: this.service.admin_form['value']['role'],
        password: this.service.admin_form['value']['password'],
        }
    }

    this.api.updateUser(updatedUser,id).subscribe(response =>{
      console.log(response)
    })


   }


}
