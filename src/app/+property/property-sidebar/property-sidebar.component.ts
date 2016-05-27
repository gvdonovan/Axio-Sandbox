import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'property-sidebar',
  template: require('./property-sidebar.component.html'),
  // template: `<a class="sidebar-brand m-b-0 sidebar-brand-bg sidebar-brand-border">Axio Workspace</a>`,
  styles: [require('./property-sdiebar.component.scss')]
})
export class PropertySidebarComponent implements OnInit{
  @Input() model: any;

  ngOnInit() {
  }
}
