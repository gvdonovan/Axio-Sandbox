import {Injectable, Inject} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {API_CONFIG} from '../config';
import {FactoryService} from "./factory.service";
import {Property} from '../interfaces';

@Injectable()
export class SearchService {

  private searchResultSource = new BehaviorSubject<Array<Property>>([]);
  searchResult$ = this.searchResultSource.asObservable();

  constructor(@Inject('_') private _, private http: Http, private factoryService: FactoryService) {}

  basicSearch(term: string): Observable<Array<Property>> {
    return this.http.get(API_CONFIG.base + API_CONFIG.propertyApi.base + '/search/' + term)
      .map(res => {
        return this._.map(res.json(),data => { return this.factoryService.createProperty(data);});//this.factoryService.createProperty(res.json());
      });
  }

  advancedSearch(terms: Object): any {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(API_CONFIG.base + API_CONFIG.propertyApi.base + '/search-advanced', JSON.stringify(terms), options)
      .map(res => {
        return this._.map(res.json(),data => { return this.factoryService.createProperty(data);});
      });
  }

  setSearchResults(_searchResult: Array<Property>): void {
    this.searchResultSource.next(_searchResult);
  }
  
  searchPropertiesByState(stateId, searchTerm): Observable<Response> {
    return this.http.get(API_CONFIG.base + API_CONFIG.propertyApi.base + '/search-by-state/' + stateId + '/' + searchTerm);
  }
}
