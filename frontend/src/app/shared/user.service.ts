import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms'
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  constructor(private fb: FormBuilder) { }
  admin_form: FormGroup = this.fb.group({
    _id: new FormControl(''),
    fullname: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    assigned_document_identifiers: new FormControl(''),
    assigned_users: this.fb.array([])
  })



  InitializeFormGroup() {
    this.admin_form.setValue({
      _id: "",
      fullname: "",
      email: "",
      role: "",
      password: "",
      assigned_document_identifiers: [],
      assigned_users: [],
    })
  }

  populateForm(user) {

    if (user['role'] === 'admin') {
      const admin = {
        _id: user['_id'],
        fullname: user['fullname'],
        email: user['email'],
        role: user['role'],
        password: user['password'],
        assigned_document_identifiers: [],
        assigned_users: [],
      }
      this.admin_form.setValue(_.omit(admin, ['generation_time', 'id']));
    }
    if (user['role'] === 'annotator') {
      const annotator = {
        _id: user['_id'],
        fullname: user['fullname'],
        email: user['email'],
        role: user['role'],
        password: user['password'],
        assigned_document_identifiers: user['assigned_document_identifiers'] ? user['assigned_document_identifiers'].join("\n") : '',
        assigned_users: [],
      }
      this.admin_form.setValue(_.omit(annotator, ['generation_time', 'id']));
    }
    if (user['role'] === 'validator') {
      const validator = {
        _id: user['_id'],
        fullname: user['fullname'],
        email: user['email'],
        role: user['role'],
        password: user['password'],
        assigned_document_identifiers: user['assigned_document_identifiers'] ? user['assigned_document_identifiers'] : '',
        assigned_users: []
      }
      this.admin_form.setValue(_.omit(validator, ['generation_time', 'id']));
      for (let index = 0; index < user['assigned_users'].length; index++) {
        let assigned_user = this.fb.group({
          email: new FormControl(user['assigned_users'][index]['email']),
          assigned_document_identifiers: new FormControl((user['assigned_users'][index]['assigned_document_identifiers'].join("\n")))
        })
        this.assigned_users.push(assigned_user);

      }
    }
  }

  get assigned_users() {
    return this.admin_form.get('assigned_users') as FormArray
  }

  addAssignedUserGroup() {
    return this.fb.group({
      email: new FormControl(''),
      assigned_document_identifiers: new FormControl([])
    }
    )
  }
  addAssignedUser() {
    this.assigned_users.push(this.addAssignedUserGroup());
  }

  deleteAssignedUser(i) {
    this.assigned_users.removeAt(i);
  }

  resetAssignedUser() {

  }
}
