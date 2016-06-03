import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { ControlGroup, Control, Validators } from '@angular/common';
import {WebAddress} from "../interfaces/property.interface";

@Component({
    selector: 'form-webaddress',
    template: require('./form-webaddress.component.html'),
    styleUrls: []
})
export class FormWebAddressComponent implements OnInit{

    form: ControlGroup;
    @Input() model: any;
    @Output() webAddressChanged: EventEmitter<Object> = new EventEmitter();

    ngOnInit() {
        this.form = new ControlGroup({
            url: new Control((this.model && this.model.url) || '',Validators.compose([Validators.required]))
        });

        this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
            value => {
                this.webAddressChanged.emit({value: value, valid: this.form.valid});
            });
    }
}
