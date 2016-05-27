import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ControlGroup, Control, Validators, AbstractControl } from '@angular/common';
import {Address} from "../interfaces";

@Component({
  selector: 'form-address',
  template: require('./form-address.component.html'),
  directives: [],
  providers: [],
  styles:[
    `
    .form-header {
      margin-bottom: 8px;
    }
  `
  ]
})
export class FormAdressComponent implements OnInit{

  form: ControlGroup;
  @Input() model: Address;
  @Output() addressChanged: EventEmitter<Object> = new EventEmitter();

  constructor() {
  }
  ngOnInit() {
    
    this.form = new ControlGroup({
      street: new Control((this.model && this.model.streetName) || '', Validators.compose([Validators.required, streetValidator])),
      city: new Control((this.model && this.model.city) || '', Validators.compose([Validators.required])),
      state: new Control((this.model && this.model.state.shortName), Validators.compose([Validators.required])),
      zipcode: new Control((this.model && this.model.zipCode) || '', Validators.compose([Validators.required, zipCodeValidator]))
    });

    this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(value => {this.addressChanged.emit({value: value, valid: this.form.valid});});
  }
}

function streetValidator(input: AbstractControl) : { [key: string]: any } {
  const validStreetRegex = /\d+\s\w+/;
  if (validStreetRegex.test(input.value)) return null;
  return { "invalidStreet": true };
}

function zipCodeValidator(input: AbstractControl) {
  const validZipCode = /\d{5}/;
  if (validZipCode.test(input.value)) return null;
  return { "invalidZipCode": true };
}
