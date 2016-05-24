import {Component, OnInit} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {LayoutComponent, NavbarComponent, SidebarComponent, SidebarToggleDirective} from 'ng2-bootstrap-layout';
import {Sidebar, SidebarToggle} from 'bootstrap-layout';
import {RouterActiveDirective} from 'ng2-router-active';
import {BUTTON_DIRECTIVES, CollapseDirective} from 'ng2-bootstrap/ng2-bootstrap';

import { HomeComponent } from "../+home/index"
import { CompanyComponent } from "../company/company.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { PropertyComponent } from "../+properties/+property/index";
import { AdvancedSearchComponent } from "../+properties/+advanced-search/index";

declare var jQuery:any;

@Component({
    selector: 'app',
    template: require('./shell.component.html'),
    styles: [
        require('./shell.component.scss')],
    directives: [
        ROUTER_DIRECTIVES,
        LayoutComponent,
        NavbarComponent,
        SidebarToggleDirective,
        SidebarComponent,
        RouterActiveDirective,
        BUTTON_DIRECTIVES,
        CollapseDirective
    ],
    providers: [
        Sidebar,
        SidebarToggle
    ]
})

@Routes([
    {path: '/home', component: HomeComponent}, //, name: 'Dashboard', useAsDefault: true },
    {path: '/dashboard', component: DashboardComponent}, //, name: 'Dashboard', useAsDefault: true },
    {path: '/property/:propertyId', component: PropertyComponent }, //, name: 'Property' },
    {path: '/advanced-search', component: AdvancedSearchComponent }, //, name: 'AdvancedSearch' },
    {path: '/company/:companyId', component: CompanyComponent}, //, name: 'Company' }

])
export class ShellComponent implements OnInit {
    public isCollapsed:boolean = true;

    public radioModel:string = 'Property';

    constructor(private router:Router) {
    }

    ngOnInit() {
       console.log('biff');
        this.router.navigate(['/app/home']);
    }
}
