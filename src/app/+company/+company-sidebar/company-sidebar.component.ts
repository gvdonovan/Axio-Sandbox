import { Component, Input } from '@angular/core';

@Component({
	selector: 'company-sidebar',
	template: require('./company-sidebar.component.html')
})
export class CompanySidebarComponent {
	@Input('model') company: any;

	get properties() {
		return this.company && this.company.properties ? this.company.properties.slice(0, 3).filter((f) => !!f.name) : [];
	}
}

