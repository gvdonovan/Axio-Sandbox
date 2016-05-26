import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {Address, Coordinate, PhoneNumber, Company} from "../../shared/interfaces";
import { RouteSegment, ROUTER_DIRECTIVES } from '@angular/router';
import { CompanyService} from '../shared';
import {DataTableDirectives} from "angular2-datatable/datatable";
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {SebmGoogleMapMarker, SebmGoogleMap, SebmGoogleMapInfoWindow} from "angular2-google-maps/core";
import {Panel} from "../../shared/components";
import { Property } from '../../shared/interfaces';
import {FormPhoneComponent, FormAdressComponent} from "../../shared/components";

@Component({
    selector: 'ax-company',
    template: require('./company-summary.component.html'),
    styles: [ require('./company-summary.component.scss') ],
    encapsulation: ViewEncapsulation.None,
    directives: [Panel, SebmGoogleMap, SebmGoogleMapMarker, SebmGoogleMapInfoWindow, FormAdressComponent, DataTableDirectives, DROPDOWN_DIRECTIVES, FormPhoneComponent],
    providers: [CompanyService]

})
export class CompanySummaryComponent implements OnInit{
    company: Company;
    companyId: string;
    markers: Array<Property> = [];
    formValid: boolean = false;
    bigValue: Object = { value: 'abcde'};

    currentAddress: Address = {
        id: null,
        type: '',
        streetName: '3805 164th St',
        city: 'Lynnwood',
        zipCode: '75013',
        zipCodeExtension: '',
        state: {
            id: null,
            name: '',
            shortName: 'WA',
            fipsCode: null
        }
    };

    currentPhoneNumber: PhoneNumber = {
        id: null,
        primaryNumber: '6172123456',
        extension: ''
    };


    constructor(public companyService: CompanyService,
                @Inject('moment') private moment,
                @Inject('_') private _,
                params: RouteSegment) {
        this.companyId = params.getParam('companyId');
    }

    ngOnInit(): void {
        this.companyService.getCompany(this.companyId)
            .subscribe(
                res => {
                    this.company = res;

                    this.markers = this.company.properties;
                }
            )
    };

    onAddressChange(e: any) {
        this.formValid = e.valid;
        console.log(e);
    }
}
