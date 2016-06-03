import { Component, Output, Input, EventEmitter, OnInit, Inject } from '@angular/core';
import { ControlGroup, Control, Validators, AbstractControl } from '@angular/common';
import {Address} from "../interfaces";
import {STATES} from '../data';
import {TYPEAHEAD_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";

@Component({
  selector: 'form-address',
  template: require('./form-address.component.html'),
  directives: [
      TYPEAHEAD_DIRECTIVES
  ],
  providers: [],
  styles:[
    `
    .form-header {
      margin-bottom: 8px;
    }
  `
  ]
})
export class FormAdressComponent implements OnInit {

  form:ControlGroup;
  @Input() model: any;
  @Output() addressChanged:EventEmitter<Object> = new EventEmitter();

  constructor(@Inject('_') private _) {
  }

  ngOnInit() {

    this.form = new ControlGroup({
      streetName: new Control((this.model && this.model.streetName) || '', Validators.compose([Validators.required, streetValidator])),
      city: new Control((this.model && this.model.city) || '', Validators.compose([Validators.required])),
      stateProvinceId: new Control((this.model && this.model.stateProvinceId), Validators.compose([Validators.required])),
      zipCode: new Control((this.model && this.model.zipCode) || '', Validators.compose([Validators.required, zipCodeValidator]))
    });

    if(this.model && this.model.stateProvinceId){
      this.stateProvinceId.model = this.stateProvinceId.transform(this.model.stateProvinceId);
    }

    this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(value => {
      this.addressChanged.emit({value: value, valid: this.form.valid});
    });
  }

  stateProvinceId = {
    model: '',
    typeahead: () => {
      return this._.map(STATES, 'name');
    },
    typeaheadOnSelect: (e:any) => {
      let currentState = this._.find(STATES, {name: e.item});
      if (currentState) {
        (<Control>this.form.find('stateProvinceId')).updateValue(currentState.id);
      }
    },
    transform: (stateProvinceId) => {
      return this._.find(STATES, {id: stateProvinceId}).name;
    },
    typeaheadOnValueChanged: (value: string) => {
      //when deleted, update ng control
      if(!value) {
        (<Control>this.form.find('stateProvinceId')).updateValue(value);
      }
    }
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
