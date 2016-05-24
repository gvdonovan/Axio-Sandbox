import {Component} from '@angular/core';
import {Panel} from '../workspace/widget/panel';

@Component({
  selector: 'dashboard',
  template: require('./dashboard.component.html'),
  directives: [Panel]
})

export class DashboardComponent {
}
