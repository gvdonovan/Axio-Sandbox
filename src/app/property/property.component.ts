import {Component, OnInit, Inject} from '@angular/core';
// import { AllowedForRoles } from '../login/canactivate';
import {Panel} from '../workspace/widget/panel';
import {Property} from './../shared/interfaces';
import {PropertyService} from './property.service';
import {FactoryService} from '../shared/services';
import { RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import {SebmGoogleMapMarker,
  SebmGoogleMap} from 'angular2-google-maps/core';
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";

@Component({
  selector: 'property',
  template: require('./property.component.html'),
  styles: [`
    .sebm-google-map-container {
      height: 300px;
    }
  `],
  directives: [Panel, SebmGoogleMap, SebmGoogleMapMarker, DROPDOWN_DIRECTIVES, ROUTER_DIRECTIVES]
})
// @AllowedForRoles(['Admin'])
export class PropertyComponent implements OnInit {
  property: Property;
  propertyId: string;

  markerClicked(): void {
    console.log('clicked');
  }

  constructor(public propertyService: PropertyService,
              @Inject('moment') private moment,
              params: RouteParams) {
    this.propertyId =   params.get('propertyId');
  }

  ngOnInit(): void {
    this.propertyService.getProperty(this.propertyId).subscribe(res => {
      this.property = res;
    });
  }
}
