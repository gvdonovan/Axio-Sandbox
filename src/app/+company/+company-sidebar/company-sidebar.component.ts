import { Component, Input } from '@angular/core';

@Component({
	selector: 'company-sidebar',
	template: require('./company-sidebar.component.html')
})
export class CompanySidebarComponent {
	@Input('model') company: any;
}

