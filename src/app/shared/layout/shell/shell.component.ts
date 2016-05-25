import {Component, OnInit} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';
import {LayoutComponent, NavbarComponent, SidebarComponent, SidebarToggleDirective} from 'ng2-bootstrap-layout';
import {Sidebar, SidebarToggle} from 'bootstrap-layout';
import {RouterActiveDirective} from 'ng2-router-active';
import {BUTTON_DIRECTIVES, CollapseDirective} from 'ng2-bootstrap/ng2-bootstrap';

import { AdminHomeComponent } from "../../../+admin/index";
import { HomeComponent } from "../../../+home/index"
import { CompanySummaryComponent } from "../../../+company/index";
import { DashboardComponent } from "../../../+dashboard/index";
import { PropertySummaryComponent } from "../../../+property/index";
import { PropertySearchComponent } from "../../../+property/index";
import { UserService } from '../../../services';

@Component({
    selector: 'app',
    template: require('./shell.component.html'),
    styles: [ require('./shell.component.scss') ],
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
    public searchTypeModel:string = 'Property';

    constructor(private router:Router, private userService: UserService) {}

    ngOnInit() {
        this.router.navigate(['/app/home']);
    }

    logout() {
        this.userService.logout();
    }
}
