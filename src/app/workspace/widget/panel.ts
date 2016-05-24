import {Component, Input, OnInit} from '@angular/core';
import {CollapseDirective, DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
@Component({
  selector: 'panel',
  template: require('./panel.html'),
  styles: [],
  directives: [CollapseDirective, DROPDOWN_DIRECTIVES]
})
export class Panel implements OnInit{
  @Input() showCollapse: boolean;

  ngOnInit() {
    if (this.showCollapse === undefined) {
      this.showCollapse = true;
    }
  }
}
