import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ControlGroup, Control } from '@angular/common';
import {Address} from "../interfaces/property.interface";

@Component({
  selector: 'form-address',
  template: require('./form-address.component.html'),
  directives: [],
  providers: []
})
export class FormAdressComponent implements OnInit{

  form: ControlGroup;
  @Input() currentAddress: Address;
  @Output() addressChanged: EventEmitter<Object> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {

    this.form = new ControlGroup({
      street: new Control((this.currentAddress && this.currentAddress.streetName) || ''),
      city: new Control((this.currentAddress && this.currentAddress.city) || ''),
      state: new Control((this.currentAddress && this.currentAddress.state.shortName) || ''),
      zipcode: new Control((this.currentAddress && this.currentAddress.zipCode) || '')
    });

    this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(value => {this.addressChanged.emit(value);});
  }
}
