import { Component } from '@angular/core';
import {LayoutComponent, NavbarComponent, SidebarComponent, SidebarToggleDirective} from 'ng2-bootstrap-layout';
import {Sidebar, SidebarToggle} from 'bootstrap-layout';

@Component({    
    selector: 'ax-property',
    template: require('./property-summary.component.html'),
    styles: [ require('./property-summary.component.scss') ],
    directives: [
        LayoutComponent,
        NavbarComponent,
        SidebarToggleDirective,
        SidebarComponent

    ],
    providers: [
        Sidebar,
        SidebarToggle
    ]

})
export class PropertySummaryComponent {}
