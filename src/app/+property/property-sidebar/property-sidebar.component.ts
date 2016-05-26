import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'property-sidebar',
  template: require('./property-sidebar.component.html'),
  styleUrls: [require('./property-sdiebar.component.scss')]
})
export class PropertySidebarComponent implements OnInit{
  @Input() model: any;
  
  ngOnInit() {
    
  }
}
