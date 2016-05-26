import { Component, ElementRef, Input } from '@angular/core';
import { SidebarComponent } from 'ng2-bootstrap-layout';
import { Sidebar } from 'bootstrap-layout';

@Component({
	selector: 'ng2-bl-sidebar',
	template: `<div class="sidebar sidebar-dark bg-primary" [id]="id" position="position" ng2-bl-scrollable>
			<ng-content></ng-content>
		</div>`
})
export class RightSidebarComponent extends SidebarComponent {
	@Input('sidebar-id') id: String;
	@Input('position') position:  String = 'left';

	constructor(private _elementRef: ElementRef, private _sidebar: Sidebar) {
		super(_elementRef, _sidebar);
	}

	ngAfterViewInit() {
		super.ngAfterViewInit();
		if (this.position && this.position === 'right') {
			let children = this._elementRef.nativeElement.children;
			if (children && children.length) {
				let sidebar = children[0];
				sidebar.classList.remove('sidebar-left');
				sidebar.classList.add('sidebar-right');
				sidebar.classList.add('ls-top-navbar-xs-up');
			}
		}
	}
}
