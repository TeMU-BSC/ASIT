import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms'
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class TermService {

  constructor(private fb: FormBuilder) { }
  term_form: FormGroup = this.fb.group({
    _id: new FormControl(''),
    code: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    terminology: new FormControl('', Validators.required),
    synonyms: new FormControl('')
  })


  InitializeFormGroup() {
    this.term_form.setValue({
      _id: "",
      code: "",
      description: "",
      name: "",
      terminology: "",
      synonyms: [],
    })
  }

  populateForm(term) {
    const new_term = {

      _id: term['_id'],
      code: term['code'],
      description: term['description'],
      name: term['name'],
      terminology: term['terminology'],
      synonyms: term['synonyms'] ? term['synonyms'].join("\n") : "",
    }

    console.log(new_term)
    this.term_form.setValue(new_term)
  }
}
