import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SidebarService {
    public sidebardShow$: EventEmitter<any>;

    constructor() {
        this.sidebardShow$ = new EventEmitter();
    }

    public showSidebar(value: any) {
        this.sidebardShow$.emit(value);
    }

    public hideSidebar() {
        this.sidebardShow$.emit(null);
    }
}
