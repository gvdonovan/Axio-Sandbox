import { Component, Inject, OnInit } from '@angular/core';
import {LayoutComponent, NavbarComponent, SidebarComponent, SidebarToggleDirective} from 'ng2-bootstrap-layout';
import {Sidebar, SidebarToggle} from 'bootstrap-layout';
import { RouteSegment, ROUTER_DIRECTIVES } from '@angular/router';
import {Panel} from '../../shared/components';
import {SebmGoogleMapMarker,
    SebmGoogleMap} from 'angular2-google-maps/core';
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {Property} from '../../shared/interfaces';
import {PropertyService} from '../shared';

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
        ROUTER_DIRECTIVES
    ],
    providers: [
        Sidebar,
        SidebarToggle,
        PropertyService
    ]

})
export class PropertySummaryComponent implements OnInit {
    property: Property;
    propertyId: string;

    constructor(public propertyService: PropertyService,
                @Inject('moment') private moment,
                params: RouteSegment) {
        this.propertyId =   params.getParam('propertyId');
    }

    ngOnInit(): void {
        this.propertyService.getProperty(this.propertyId).subscribe(res => {
            this.property = res;
        });
    }
}