import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ControlGroup, Control } from '@angular/common';
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
      street: new Control((this.model && this.model.streetName) || ''),
      city: new Control((this.model && this.model.city) || ''),
      state: new Control((this.model && this.model.state.shortName) || ''),
      zipcode: new Control((this.model && this.model.zipCode) || '')
    });

    this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(value => {this.addressChanged.emit({value: value, valid: this.form.valid});});
  }
}
