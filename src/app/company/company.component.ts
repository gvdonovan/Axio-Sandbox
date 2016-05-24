import {Component, ViewEncapsulation, OnInit, Inject} from "@angular/core";
import {SebmGoogleMapMarker, SebmGoogleMap} from "angular2-google-maps/core";
import {Panel} from "../workspace/widget/panel";
import {FormAdressComponent} from "../shared/components/form-address.component";
import {Address, Coordinate} from "../shared/interfaces/property.interface";
import {DataTableDirectives} from "angular2-datatable/datatable";
import {DROPDOWN_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import {CompanyService} from "./company.service";
import { RouteParams } from '@angular/router-deprecated';
import {Company} from "../shared/interfaces/company.interface";

@Component({
  selector: 'company',
  template: require('./company.component.html'),
  styles: [require('./tables.scss')],
  encapsulation: ViewEncapsulation.None,
  directives: [Panel, SebmGoogleMap, SebmGoogleMapMarker, FormAdressComponent, DataTableDirectives, DROPDOWN_DIRECTIVES],
  providers: [CompanyService]
})
export class CompanyComponent implements OnInit{
  company: Company;
  companyId: string;
  markers: Array<Coordinate> = [];

  filter(): void {
  };

  constructor(public companyService: CompanyService,
              @Inject('moment') private moment,
              @Inject('_') private _,
              params: RouteParams) {
    this.companyId = params.get('companyId');
  }

  ngOnInit(): void {
    this.companyService.getCompany(this.companyId)
      .subscribe(
        res => {
          this.company = res;

          this.markers = this._.map(this.company.properties, 'coordinate');
        }
      )
  };
}
