import {Component, EventEmitter, OnInit, ElementRef, Inject} from '@angular/core';
import {TOOLTIP_DIRECTIVES, TYPEAHEAD_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {ConfigService} from '../config';
import { UserService } from '../../services';
import {SearchService} from "../../shared/services/search.service";
import {Http} from "@angular/http";
import {STATES} from "../../shared/data/states"; 

@Component({
  selector: '[navbar]',
  events: ['toggleSidebarEvent', 'toggleChatEvent'],
  directives: [TOOLTIP_DIRECTIVES, ROUTER_DIRECTIVES, TYPEAHEAD_DIRECTIVES],
  template: require('./navbar.html')
})
export class Navbar implements OnInit {
  toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  toggleChatEvent: EventEmitter<any> = new EventEmitter();
  config: any;
  searchTerm: string;
  searched: boolean = false;

  states: Object[] = this._.map(STATES,(data)=>{
    return {id: data.id, name: data.shortName}
  });

  constructor(
    el: ElementRef, config: ConfigService, public router: Router,
    private userService: UserService, private searchService: SearchService,
    private http: Http, @Inject('_') public _
  ) {
    this.config = config.getConfig();
  }

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }

  toggleChat(): void {
    // this.toggleChatEvent.emit(null);
  }

  search(value: string): void {
    this.searched = true;
    this.searchService.basicSearch(value)
      .subscribe(properties => {
        if(properties.length === 1) {
          this.router.navigate(['Property', {propertyId: properties[0].id}]);
        }
        else if (properties.length > 1) {
          this.router.navigate(['AdvancedSearch']);
          this.searchService.setSearchResults(properties);
        }

      });
  }

  public getContext():any {
    return this;
  }

  private getAsyncData(context:any):Function {

    if(context.searchTerm && context.searchTerm.indexOf(':') !== -1
      && context.searchTerm.split(':')[1]
      && context._.find(context.states,{name : context.searchTerm.split(':')[0].trim().toUpperCase()})
      && context.searchTerm.split(':')[1].trim()) {
      let stateName = context.searchTerm.split(':')[0].trim();
      return function ():Promise<Object[]> {
        return context.http.get('http://localhost:59176/api/properties/search-by-state/' +
          context._.find(context.states,{name : stateName.toUpperCase()}).id + '/' + context.searchTerm.split(':')[1].trim()) .map((response) => {
            return context._.map(response.json(), data => {
              data.data = data.propertyName + ' -- ' + data.streetName + ', ' + data.city;
              return data;
            });
          }).toPromise();
      };
    } else {
      return this.getEmptyPromise();
    }
  }

  private typeaheadOnSelect(e: any): void {
    this.router.navigate(['Property', {propertyId: e.item.propertyId}]);
  }

  private getEmptyPromise(): Function {
    return function(): Promise<Object[]> {return new Promise((resolve: Function) => {
          return resolve([]);
        })};
  }

  keyPressed(keyCode: number, value: string): void {
    if (keyCode === 13 && value.indexOf(':') === -1) {
      this.search(value);
    }
  }

  ngOnInit(): void {
  }

  logout() {
    this.userService.logout();
  }
}
