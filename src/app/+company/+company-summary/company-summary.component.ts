import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import  { Control } from '@angular/common';
import { Http } from '@angular/http';
import {Address, Coordinate, PhoneNumber, Company, CompanyOwnedProperty} from "../../shared/interfaces";
import { RouteSegment, ROUTER_DIRECTIVES } from '@angular/router';
import { CompanyService} from '../shared';
import {DataTableDirectives} from "angular2-datatable/datatable";
import {
    DROPDOWN_DIRECTIVES, TYPEAHEAD_DIRECTIVES
} from "ng2-bootstrap/ng2-bootstrap";
import {SebmGoogleMapMarker, SebmGoogleMap, SebmGoogleMapInfoWindow} from "angular2-google-maps/core";
import {Panel} from "../../shared/components";
import { Property } from '../../shared/interfaces';
import { PhoneNumberPipe } from '../../shared/pipes';
import {FormPhoneComponent, FormAdressComponent, FormWebAddressComponent} from "../../shared/components";
import {SearchService, FactoryService, SidebarService, HttpClient} from "../../shared/services";
import {STATES} from "../../shared/data";

import {ToastsManager} from '../../../vendor/ng2-toastr/ng2-toastr';

declare var jQuery: any;

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
        FormWebAddressComponent,
        TYPEAHEAD_DIRECTIVES,
        ROUTER_DIRECTIVES
    ],
    providers: [CompanyService, HttpClient],
    pipes: [PhoneNumberPipe]

})
export class CompanySummaryComponent implements OnInit{
    company: Company;
    companyId: string;
    //markers: Array<Property> = [];
    properties: Array<CompanyOwnedProperty> = [];

    isEditingAddress: boolean;
    isEditingPhoneNumber: boolean;
    isEditingWebAddress: boolean;
    isCreatingNew: boolean;
    editingAddress: any;
    editingPhonenumber: any;
    editingWebAddress:any;
    pendingEdits: any;

    addPropertiesData: Array<any> = [];
    pendingProperty: Object;
    addPropertiesValid: boolean = false;
    formValid: boolean = false;
    addPropertiesModalsearchTerm: string = '';
    propertiesTableFilter: Control = new Control();
    states: Object[] = this._.map(STATES,(data)=>{
        return {id: data.id, name: data.shortName}
    });


    constructor(public companyService: CompanyService,
                @Inject('moment') private moment,
                @Inject('_') private _,
                params: RouteSegment,
                private http: Http,
                private searchService: SearchService,
                private factoryService: FactoryService,
                private sidebarService: SidebarService,
                public toastr: ToastsManager) {
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
                return (value.property.name || '').toLowerCase().indexOf(term.trim().toLowerCase()) !== -1
                    || (value.property.address.city || '').toLowerCase().indexOf(term.trim().toLowerCase()) !== -1
                    || (value.property.address.streetName || '').toLowerCase().indexOf(term.trim().toLowerCase()) !== -1
                    || (value.property.market.name || '').toLowerCase().indexOf(term.trim().toLowerCase()) !== -1
            });
        });

    };

    protected refreshCompany(): void {
        this.companyService.getCompany(this.company.id.toString())
            .subscribe(
                company => {
                    this.company = company;

                    this.properties = this.company.properties;

                    this.sidebarService.showSidebar(this.company);
                }
            )
    }

    /**
     *
     * address editing
     *
     * */

    getAddress(): string {
        return this.company.address && this.company.address.streetName && this.company.address.city &&
        this.company.address.state && this.company.address.state.shortName && this.company.address.zipCode ?
            (this.company.address.streetName + ', ' + this.company.address.city + ' ' + this.company.address.state.shortName +
        ' ' + this.company.address.zipCode) : '';
    }

    editAddress(id: string): void {

        this.isEditingPhoneNumber = false;
        this.isEditingWebAddress = false;

        this.companyService.getAddress(id)
            .subscribe(address => {

                // empty address, do create
                if(this._.isEmpty(address)) {
                    this.isCreatingNew = true;
                }// not empty, do update
                else {
                    this.isCreatingNew = false;
                }

                this.editingAddress = address;
                this.pendingEdits = address;
                jQuery('#editModal').modal({backdrop: false});
                this.isEditingAddress = true;
            })
    }

    onAddressChange(e: any) {
        this.formValid = e.valid;

        if(this.formValid) {
            this._.assign(this.pendingEdits,e.value);
        }
    }

    /**
     *
     * phone number editing
     * */

    editPhoneNumber(id: string): void {
        
        this.isEditingAddress = false;
        this.isEditingWebAddress = false;
        
        this.companyService.getPhoneNumber(id)
            .subscribe(phoneNumber => {

                // empty address, do create
                if(this._.isEmpty(phoneNumber)) {
                    this.isCreatingNew = true;
                }// not empty, do update
                else {
                    this.isCreatingNew = false;
                }

                this.editingPhonenumber = phoneNumber;
                this.pendingEdits = phoneNumber;
                jQuery('#editModal').modal({backdrop: false});
                this.isEditingPhoneNumber = true;
            })

    }

    onPhoneNumberChanged(e: any) {
        this.formValid = e.valid;

        if(this.formValid) {
            this._.assign(this.pendingEdits,e.value);
        }

    }

    /**
     *
     * web address editing
     * */

    editWebAddress(id:string): void {

        this.isEditingAddress = false;
        this.isEditingPhoneNumber = false;

        this.companyService.getWebAddress(id)
            .subscribe(
                webAddress => {

                    // empty address, do create
                    if(this._.isEmpty(webAddress)) {
                        this.isCreatingNew = true;
                    }// not empty, do update
                    else {
                        this.isCreatingNew = false;
                    }

                    this.editingWebAddress = webAddress;
                    this.pendingEdits = webAddress;
                    jQuery('#editModal').modal({backdrop: false});
                    this.isEditingWebAddress = true;
                }
            )
    }

    onWebAddressChanged(e: any): void {
        this.formValid = e.valid;

        if(this.formValid) {
            this._.assign(this.pendingEdits,e.value);
        }
    }

    saveEdits(): void {
        if(this.isEditingAddress) {
            
            if(this.isCreatingNew) {
                this.companyService.createAddress(this.company.id,this.pendingEdits)
                    .subscribe(
                        response => {
                            this.toastr.success('The data has been updated successfully!');
                            this.refreshCompany();
                            this.isEditingAddress = false;
                        }
                    )
            }
            else {
                this.companyService.editAddress(this.company.id,this.pendingEdits)
                    .subscribe(
                        response => {
                            this.refreshCompany();
                            this.isEditingAddress = false;
                        }
                    );
            }
        }
        else if(this.isEditingPhoneNumber) {

            if(this.isCreatingNew) {
                this.companyService.createPhoneNumber(this.company.id, this.pendingEdits)
                    .subscribe(
                        response => {
                            this.toastr.success('The data has been updated successfully!');
                            this.refreshCompany();
                            this.isEditingPhoneNumber = false;
                        }
                    )
            }
            else {
                this.companyService.editPhoneNumber(this.company.id, this.pendingEdits)
                    .subscribe(
                        response => {
                            this.refreshCompany();
                            this.isEditingPhoneNumber = false;
                        }
                    )
            }
        }
        else if(this.isEditingWebAddress) {
            if(this.isCreatingNew) {
                this.companyService.createWebAddress(this.company.id, this.pendingEdits)
                    .subscribe(
                        response => {
                            this.toastr.success('The data has been updated successfully!');
                            this.refreshCompany();
                            this.isEditingWebAddress = false;
                        }
                    );

            }
            else {
                this.companyService.editWebAddress(this.company.id, this.pendingEdits)
                    .subscribe(
                        response => {
                            this.refreshCompany();
                            this.isEditingWebAddress = false;
                        }
                    );
            }
        }
    }

    cancelEdits(): void {
        this.isEditingAddress = false;
        this.isEditingPhoneNumber = false;
        this.isEditingWebAddress = false;

        this.pendingEdits = null;
        this.editingAddress = null;
        this.editingPhonenumber = null;
        this.editingWebAddress = null;
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
        if (this._.find(this.company.properties, data => { return data.property.id === e.item.propertyId })) {
            this.pendingProperty = null;
            this.toastr.error('property already owned/managed by this company! Please choose another one.');
        }
        else {
            e.item.stateName = this.addPropertiesModalsearchTerm.split(':')[0].trim().toUpperCase();
            this.pendingProperty = e.item;
        }
    }

    private selectedTypeChanged(e: any, rowIndex: number): void {
        if(e.target.value === '0') {
            this.addPropertiesData[rowIndex].type = null;
        }
        else {
            this.addPropertiesData[rowIndex].type = e.target.value;
        }

        this.addPropertiesValid = this.checkAddPropertiesValid();
    }

    private inputDateChanged(e: any, rowIndex: number, startEnd: string):void {
        let DATE_REGEX = /^\d{2}-\d{2}-\d{4}$/i;

        if(e.target.value && e.target.value.trim().length === 10) {
            let match  = e.target.value.match(DATE_REGEX);

            if(match) {
                this.addPropertiesData[rowIndex][startEnd + 'Date'] = this.moment(match[0],'MM-DD-YYYY').toDate();
            }
            else {
                this.addPropertiesData[rowIndex][startEnd + 'Date'] = null;
            }
        }
        else {
            this.addPropertiesData[rowIndex][startEnd + 'Date'] = null;
        }

        this.addPropertiesValid = this.checkAddPropertiesValid();
    }

    protected checkAddPropertiesValid() {
        return this._.filter(this.addPropertiesData,data => {
            return data.type && data.startDate;
        }).length === this.addPropertiesData.length && this.addPropertiesData.length > 0;
    }

    AddPropertyToTable(): void {
        if(this.pendingProperty) {
            this.addPropertiesData.push(this.pendingProperty);
            this.addPropertiesData = this._.uniqBy(this.addPropertiesData, 'propertyId');
        }

        this.addPropertiesValid = this.checkAddPropertiesValid();
    }
    deleteRow(rowIndex: number): void {
        this.addPropertiesData = this._.filter(this.addPropertiesData,(value, index) => { return index !== rowIndex;});
    }

    cancelAddProperties(): void {
        this.addPropertiesData = [];
        this.addPropertiesModalsearchTerm = '';
        this.pendingProperty = null;
    }

    OKAddProperties(): void {
        
        let ownedProperties = this._.map(this._.filter(this.addPropertiesData,(d) => {return d.type !== '3'; }),
            (data) => {
                return {propertyId: data.propertyId, companyId: this.company.id, startDate: data.startDate, encDate: data.endDate, propertyOwnerTypeId: Number(data.type)}
            }
        );
        let managedProperties = this._.map(this._.filter(this.addPropertiesData,{type: '3'}),
            (data) => {
                return {propertyId: data.propertyId, companyId: this.company.id, startDate: data.startDate, encDate: data.endDate}
            }
        );

        this.companyService.addProperties(ownedProperties,managedProperties)
            .subscribe(
                response => {
                    this.toastr.success('The data has been updated successfully!');
                    this.refreshCompany();

                    this.addPropertiesData = [];
                    this.addPropertiesModalsearchTerm = '';
                    this.pendingProperty = null;
                }
            );


    }
}
