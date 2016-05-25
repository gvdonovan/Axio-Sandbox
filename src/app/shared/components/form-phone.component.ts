import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import {PhoneNumber} from "../interfaces";
import { ControlGroup, Control, Validators } from '@angular/common';

@Component({
  selector: 'form-phone',
  template: require('./form-phone.component.html'),
  styleUrls: []
})
export class FormPhoneComponent implements OnInit{

  form: ControlGroup;
  @Input() model: PhoneNumber;
  @Output() phoneNumberChanged: EventEmitter<Object> = new EventEmitter();

  ngOnInit() {
    this.form = new ControlGroup({
      phoneNumber: new Control((this.model && this.model.primaryNumber) || '',Validators.pattern('([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})'))
    });

    this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(value => {this.phoneNumberChanged.emit({value: value, valid: this.form.valid});});
  }
}
