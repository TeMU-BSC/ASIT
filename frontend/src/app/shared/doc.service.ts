import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms'
import { title } from 'process';

@Injectable({
  providedIn: 'root'
})
export class DocService {

  constructor(private fb: FormBuilder) { }
  doc_form: FormGroup = this.fb.group({
    _id: new FormControl(''),
    identifier: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    abstract: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    source: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required)

  })

  InitializeFormGroup() {
    this.doc_form.setValue({
      _id: "",
      identifier: "",
      title: "",
      abstract: "",
      year: "",
      source: "",
      type: ""
    })
  }

  populateForm(doc) {
    const new_doc = {
      _id: doc['_id'],
      identifier: doc['identifier'],
      title: doc['title'],
      abstract: doc['abstract'],
      year: doc['year'],
      source: doc['source'],
      type: doc['type']
    }

    this.doc_form.setValue(new_doc);

  }



}
