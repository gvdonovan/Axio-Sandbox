import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import  { Control } from '@angular/common';
import { Http } from '@angular/http';
import {Address, Coordinate, PhoneNumber, Company} from "../../shared/interfaces";
import { RouteSegment, ROUTER_DIRECTIVES } from '@angular/router';
import { CompanyService} from '../shared';
import {DataTableDirectives} from "angular2-datatable/datatable";
import {DROPDOWN_DIRECTIVES, TYPEAHEAD_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {SebmGoogleMapMarker, SebmGoogleMap, SebmGoogleMapInfoWindow} from "angular2-google-maps/core";
import {Panel} from "../../shared/components";
import { Property } from '../../shared/interfaces';
import {FormPhoneComponent, FormAdressComponent} from "../../shared/components";
import {SearchService, FactoryService, SidebarService} from "../../shared/services";
import {STATES} from "../../shared/data";

@Component({
    selector: 'ax-company',
    template: require('./company-summary.component.html'),
    styles: [ require('./company-summary.component.scss') ],
    encapsulation: ViewEncapsulation.None,
    directives: [
        Panel,
        SebmGoogleMap,
        SebmGoogleMapMarker,
        SebmGoogleMapInfoWindow,
        FormAdressComponent,
        DataTableDirectives,
        DROPDOWN_DIRECTIVES,
        FormPhoneComponent,
        TYPEAHEAD_DIRECTIVES
    ],
    providers: [CompanyService]

})
export class CompanySummaryComponent implements OnInit{
    company: Company;
    companyId: string;
    //markers: Array<Property> = [];
    properties: Array<Property> = [];
    addPropertiesData: Array<Object> = [];
    pendingProperty: Object;
    formValid: boolean = false;
    bigValue: Object = { value: 'abcde'};
    addPropertiesModalsearchTerm: string = '';
    propertiesTableFilter: Control = new Control();

    states: Object[] = this._.map(STATES,(data)=>{
        return {id: data.id, name: data.shortName}
    });

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
                params: RouteSegment,
                private http: Http,
                private searchService: SearchService,
                private factoryService: FactoryService,
                private sidebarService: SidebarService) {
        this.companyId = params.getParam('companyId');
    }

    ngOnInit(): void {
        this.companyService.getCompany(this.companyId)
            .subscribe(
                res => {
                    this.company = res;

                    this.properties = this.company.properties;

                    this.sidebarService.showSidebar(this.company);
                }
            )

        this.propertiesTableFilter.valueChanges.debounceTime(300)
            .distinctUntilChanged().subscribe(term => {
            this.properties = this._.filter(this.company.properties,(value, index) => {
                return (value.name || '').toLowerCase().indexOf(term.trim().toLowerCase()) !== -1
                    || (value.address.city || '').toLowerCase().indexOf(term.trim().toLowerCase()) !== -1
                    || (value.address.streetName || '').toLowerCase().indexOf(term.trim().toLowerCase()) !== -1
                    || (value.market.name || '').toLowerCase().indexOf(term.trim().toLowerCase()) !== -1
            });
        });
    };

    onAddressChange(e: any) {
        this.formValid = e.valid;
        console.log(e);
    }

    /**
     *
     * Add Properties Modal
     *
     * */

    private getContext():any {
        return this;
    }

    private getAsyncData(context:any):Function {

        if(context.addPropertiesModalsearchTerm && context.addPropertiesModalsearchTerm.indexOf(':') !== -1
            && context.addPropertiesModalsearchTerm.split(':')[1]
            && context._.find(context.states,{name : context.addPropertiesModalsearchTerm.split(':')[0].trim().toUpperCase()})
            && context.addPropertiesModalsearchTerm.split(':')[1].trim()) {
            let stateName = context.addPropertiesModalsearchTerm.split(':')[0].trim();
            return function ():Promise<Object[]> {
                return context.searchService.searchPropertiesByState(
                        context._.find(context.states,{name : stateName.toUpperCase()}).id,
                        context.addPropertiesModalsearchTerm.split(':')[1].trim()
                        ).map((response) => {
                    return context._.map(response.json(), data => {
                        data.data = data.propertyName + ' -- ' + data.streetName + ', ' + data.city;
                        return data;
                    });
                }).toPromise();
            };
        } else {
            return this.getEmptyPromise();
        }
    }

    private getEmptyPromise(): Function {
        return function(): Promise<Object[]> {return new Promise((resolve: Function) => {
            return resolve([]);
        })};
    }

    private typeaheadOnSelect(e: any): void {
        e.item.stateName = this.addPropertiesModalsearchTerm.split(':')[0].trim().toUpperCase();
        this.pendingProperty = e.item;
    }

    AddPropertyToTable(value: any): void {
        this.addPropertiesData.push(this.pendingProperty);
        this.addPropertiesData = this._.uniqBy(this.addPropertiesData, 'propertyId');
    }

    deleteRow(rowIndex: number): void {
        this.addPropertiesData = this._.filter(this.addPropertiesData,(value, index) => { return index !== rowIndex;});
    }

    cancelAddProperties(): void {
        this.addPropertiesData = [];
        this.addPropertiesModalsearchTerm = '';
    }

    OKAddProperties(): void {
        this.addPropertiesData = [];
        this.addPropertiesModalsearchTerm = '';
    }
}
