import {Component, OnInit, Inject} from '@angular/core';
import {Http} from "@angular/http";
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {LayoutComponent, NavbarComponent, SidebarToggleDirective, SidebarComponent} from 'ng2-bootstrap-layout';
import {Sidebar, SidebarToggle} from 'bootstrap-layout';
import {RouterActiveDirective} from 'ng2-router-active';
import {BUTTON_DIRECTIVES, CollapseDirective, TYPEAHEAD_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import { AdminHomeComponent } from "../../../+admin/index";
import { HomeComponent } from "../../../+home/index"
import { CompanySummaryComponent } from "../../../+company/index";
import { DashboardComponent } from "../../../+dashboard/index";
import { PropertySummaryComponent } from "../../../+property/index";
import { PropertySearchComponent } from "../../../+property/index";
import {STATES} from "../../data";
import {SearchService} from "../../services";
import { UserService } from '../../../services';

@Component({
    selector: 'app',
    template: require('./shell.component.html'),
    styles: [ require('./shell.component.scss') ],
    directives: [
        ROUTER_DIRECTIVES,
        LayoutComponent,
        NavbarComponent,
        SidebarComponent,
        SidebarToggleDirective,
        RouterActiveDirective,
        BUTTON_DIRECTIVES,
        CollapseDirective,
        TYPEAHEAD_DIRECTIVES
    ],
    providers: [
        Sidebar,
        SidebarToggle
    ]
})

@Routes([
    {path: '/home', component: HomeComponent}, //, name: 'Dashboard', useAsDefault: true },
    {path: '/dashboard', component: DashboardComponent}, //, name: 'Dashboard', useAsDefault: true },
    {path: '/property/search', component: PropertySearchComponent }, //, name: 'AdvancedSearch' },
    {path: '/admin', component: AdminHomeComponent }, //, name: 'AdvancedSearch' },
    /***
     * Routes without links
     */
    {path: '/property/:propertyId', component: PropertySummaryComponent }, //, name: 'Property' },
    {path: '/company/:companyId', component: CompanySummaryComponent}, //, name: 'Company' }
])
export class ShellComponent implements OnInit {

    public isPropertyMenuCollapsed:boolean = true;
    public isCompanyMenuCollapsed: boolean = true;
    public searchTypeModel:string = 'Property';
    searchTerm: string;
    searched: boolean = false;

    states: Object[] = this._.map(STATES,(data)=>{
        return {id: data.id, name: data.shortName}
    });

    constructor(private router:Router,
                private http: Http, @Inject('_') public _,
                private searchService: SearchService,
                private userService: UserService
    ) {}

    ngOnInit() {
        this.router.navigate(['/app/home']);
    }

    public getContext():any {
        return this;
    }

    private getAsyncData(context:any):Function {

        if(context.searchTerm && context.searchTerm.indexOf(':') !== -1
            && context.searchTerm.split(':')[1]
            && context._.find(context.states,{name : context.searchTerm.split(':')[0].trim().toUpperCase()})
            && context.searchTerm.split(':')[1].trim()) {
            let stateName = context.searchTerm.split(':')[0].trim();
            return function ():Promise<Object[]> {
                return context.http.get('http://localhost:59176/api/properties/search-by-state/' +
                    context._.find(context.states,{name : stateName.toUpperCase()}).id + '/' + context.searchTerm.split(':')[1].trim()) .map((response) => {
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

    private typeaheadOnSelect(e: any): void {
        this.router.navigate(['/app/property/'+e.item.propertyId]);
    }

    private getEmptyPromise(): Function {
        return function(): Promise<Object[]> {return new Promise((resolve: Function) => {
            return resolve([]);
        })};
    }

    keyPressed(keyCode: number, value: string): void {
        if (keyCode === 13 && value.indexOf(':') === -1) {
            this.search(value);
        }
    }

    search(value: string): void {
        this.searched = true;
        this.searchService.basicSearch(value)
            .subscribe(properties => {
                if (properties.length === 1) {
                    if (this.searchTypeModel === 'Property') {
                        this.router.navigate(['/app/property/' + properties[0].id]);
                    }
                    else {
                        this.router.navigate(['/app/company/' + properties[0].id]);
                    }
                }
                else if (properties.length > 1) {
                    this.router.navigate(['/app/property/search']);
                    this.searchService.setSearchResults(properties);
                }
            });
    }

    logout() {
        this.userService.logout();
    }
}
