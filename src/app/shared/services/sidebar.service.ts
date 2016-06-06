import { Injectable, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class SidebarService {
    public sidebardShow$: EventEmitter<any>;

    constructor(
        private location: Location
    ) {
        this.sidebardShow$ = new EventEmitter();
    }

    public showSidebar(value: any) {
        this.sidebardShow$.emit(value);
    }

    public hideSidebar() {
        this.sidebardShow$.emit(null);
    }

    get isPropertySidebarVisible() : boolean {
        return location.toString().split('/').slice(3).indexOf('property') !== -1;
    }

    get isCompanySidebarVisible() : boolean {
        return location.toString().split('/').slice(3).indexOf('company') !== -1;
    }
}
