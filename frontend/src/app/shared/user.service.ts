import { Injectable } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }



  admin_form: FormGroup = new FormGroup({
    fullname: new FormControl('', Validators.required),
    email: new FormControl('',Validators.required),
    role: new FormControl(''),
    password: new FormControl('',Validators.required),
    assigned_document_identifiers: new FormControl([]),
    assigned_users: new FormControl([]),
  })

  InitializeFormGroup(){


    this.admin_form.setValue({
      fullname: "",
      email:"",
      role:"",
      password:"",
      assigned_document_identifiers: [],
      assigned_users: [],
    })


  }

  populateForm(user){
    if(user['role'] === 'admin'){
      const admin = {
      fullname: user['fullname'],
      email:user['email'],
      role:user['role'],
      password: user['password'],
      assigned_document_identifiers: [],
      assigned_users: [],
      }
      this.admin_form.setValue(_.omit(admin,['_id','generation_time','id']));
    }
    if(user['role'] === 'annotator'){
      const annotator = {
      fullname: user['fullname'],
      email:user['email'],
      role:user['role'],
      password: user['password'],
      assigned_document_identifiers: user['assigned_document_identifiers'] ?  user['assigned_document_identifiers'] : [],
      assigned_users: [],
      }
      this.admin_form.setValue(_.omit(annotator,['_id','generation_time','id']));
    }

    console.log(user['role']);

  }
}
