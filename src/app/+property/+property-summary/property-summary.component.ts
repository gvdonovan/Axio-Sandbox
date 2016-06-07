import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {LayoutComponent, NavbarComponent, SidebarComponent, SidebarToggleDirective} from 'ng2-bootstrap-layout';
import {Sidebar, SidebarToggle} from 'bootstrap-layout';
import { RouteSegment, ROUTER_DIRECTIVES } from '@angular/router';
import {Panel} from '../../shared/components';
import {SebmGoogleMapMarker,
    SebmGoogleMap} from 'angular2-google-maps/core';
import {DROPDOWN_DIRECTIVES, TYPEAHEAD_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {Property} from '../../shared/interfaces';
import {SidebarService, HttpClient} from '../../shared/services';
import {PhoneNumberPipe} from '../../shared/pipes';
import {PropertyService} from '../shared';
import {SearchService} from "../../shared/services/search.service";

import {ToastsManager} from '../../../vendor/ng2-toastr/ng2-toastr';
import {DataTableDirectives} from "angular2-datatable/datatable";

@Component({    
    selector: 'ax-property',
    template: require('./property-summary.component.html'),
    styles: [ require('./property-summary.component.scss') ],
    directives: [
        LayoutComponent,
        NavbarComponent,
        SidebarToggleDirective,
        SidebarComponent,
        Panel,
        SebmGoogleMap,
        SebmGoogleMapMarker,
        DROPDOWN_DIRECTIVES,
        TYPEAHEAD_DIRECTIVES,
        ROUTER_DIRECTIVES,
        DataTableDirectives
    ],
    providers: [
        Sidebar,
        SidebarToggle,
        PropertyService,
        HttpClient
    ],
    pipes: [PhoneNumberPipe]

})
export class PropertySummaryComponent implements OnInit, OnDestroy {
    property: Property;
    propertyId: string;

    addCompaniesModalSearchTerm: string = '';
    pendingCompany: Object;
    addCompaniesData: any[] = [];
    addCompaniesValid: boolean = false;

    constructor(public propertyService: PropertyService,
                @Inject('moment') private moment,
                params: RouteSegment,
                private sidebarService: SidebarService,
                private searchService: SearchService,
                @Inject('_') private _,
                private toastr: ToastsManager) {
        this.propertyId =   params.getParam('propertyId');
    }

    ngOnInit(): void {
        this.propertyService.getProperty(this.propertyId).subscribe(res => {
            this.property = res;

            this.sidebarService.showSidebar(res);
        });
    }

    ngOnDestroy(): void {
        this.sidebarService.hideSidebar();
    }
    
    /**
     * add companies modal
     * */
    private getContext():any {
        return this;
    }

    private getAsyncData(context:any):Function {

        if(context.addCompaniesModalSearchTerm) {
            return function ():Promise<Object[]> {
                return context.searchService.searchCompaniesByName(context.addCompaniesModalSearchTerm.trim()).toPromise();
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
        if (this._.find(this.property.owners, data => { return data.name=== e.item.name })) {
            this.pendingCompany = null;
            this.toastr.error('company already owns/manages this property! Please choose another one.');
        }
        else {
            this.pendingCompany = e.item;
        }
    }

    protected checkAddCompaniesValid() {
        return this._.filter(this.addCompaniesData,data => {
                return data.type && data.startDate;
            }).length === this.addCompaniesData.length && this.addCompaniesData.length > 0;
    }

    private selectedTypeChanged(e: any, rowIndex: number): void {
        if(e.target.value === '0') {
            this.addCompaniesData[rowIndex].type = null;
        }
        else {
            this.addCompaniesData[rowIndex].type = e.target.value;
        }

        this.addCompaniesValid = this.checkAddCompaniesValid();
    }

    private inputDateChanged(e: any, rowIndex: number, startEnd: string):void {
        let DATE_REGEX = /^\d{2}-\d{2}-\d{4}$/i;

        if(e.target.value && e.target.value.trim().length === 10) {
            let match  = e.target.value.match(DATE_REGEX);

            if(match) {
                this.addCompaniesData[rowIndex][startEnd + 'Date'] = this.moment(match[0],'MM-DD-YYYY').toDate();
            }
            else {
                this.addCompaniesData[rowIndex][startEnd + 'Date'] = null;
            }
        }
        else {
            this.addCompaniesData[rowIndex][startEnd + 'Date'] = null;
        }

        this.addCompaniesValid = this.checkAddCompaniesValid();
    }

    AddCompanyToTable(): void {
        if(this.pendingCompany) {
            this.addCompaniesData.push(this.pendingCompany);
            this.addCompaniesData = this._.uniqBy(this.addCompaniesData, 'id');
        }

        this.addCompaniesValid = this.checkAddCompaniesValid();
    }

    cancelAddCompanies(): void {
        this.addCompaniesData = [];
        this.addCompaniesModalSearchTerm = '';
        this.pendingCompany = null;
    }

    deleteRow(rowIndex: number): void {
        this.addCompaniesData = this._.filter(this.addCompaniesData,(value, index) => { return index !== rowIndex;});
    }

    OKAddCompanies(): void {
        let managers = this._.map(this._.filter(this.addCompaniesData,{type: '3'}),
            (data) => {
                return {companyId: data.id, propertyId: this.property.id, startDate: data.startDate, encDate: data.endDate}
            }
        );
        let onwers = this._.map(this._.filter(this.addCompaniesData,(d) => {return d.type !== '3'; }),
            (data) => {
                return {companyId: data.id, propertyId: this.property.id, startDate: data.startDate, encDate: data.endDate, propertyOwnerTypeId: Number(data.type)}
            }
        );

        this.propertyService.addCompanies(onwers,managers)
            .subscribe(
                response => {
                    this.toastr.success('The data has been updated successfully!');
                    this.propertyService.getProperty(this.property.id.toString()).subscribe(res => {
                        this.property = res;
                        this.sidebarService.showSidebar(res);
                    });

                    this.cancelAddCompanies();
                }
            )
    }
}