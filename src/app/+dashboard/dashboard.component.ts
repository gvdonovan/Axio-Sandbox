import {Component} from '@angular/core';
import {Panel} from '../shared/widget/panel';

@Component({
    selector: 'dashboard',
    template: require('./dashboard.component.html'),
    styles: [require('./dashboard.component.scss')],
    directives: [Panel]
})

export class DashboardComponent {
}
