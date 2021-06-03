import { Injectable } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  form: FormGroup = new FormGroup({
    fullname: new FormControl('', Validators.required),
    email: new FormControl('',Validators.required),
    role: new FormControl(''),
    password: new FormControl('',Validators.required),
    assigned_document_identifiers: new FormControl([]),
  })

  admin_form: FormGroup = new FormGroup({
    fullname: new FormControl('', Validators.required),
    email: new FormControl('',Validators.required),
    role: new FormControl(''),
    password: new FormControl('',Validators.required),
    //assigned_document_identifiers: new FormControl([]),
   // generation_time: new FormControl("")
    // assigned_users: new FormControl([]),
  })

  InitializeFormGroup(){
    this.form.setValue({
      fullname: "",
      email:"",
      role:"",
      password:"",
      assigned_document_identifiers: [],
      // assigned_users: [],
    })

    this.admin_form.setValue({
      fullname: "",
      email:"",
      role:"",
      password:"",
      //assigned_document_identifiers: [],
      // assigned_users: [],
    })


  }

  populateForm(user){
    if(user['role'] === "admin"){
      this.admin_form.setValue(_.omit(user,['_id','generation_time','id','assigned_document_identifiers']));
    }else{
      this.form.setValue(_.omit(user,['_id','generation_time']));
    }

    console.log(user['role']);

  }
}
