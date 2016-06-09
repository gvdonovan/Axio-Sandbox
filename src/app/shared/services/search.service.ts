import {Injectable, Inject} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {API_CONFIG} from '../config';
import {PropertySearchResult} from '../interfaces';

@Injectable()
export class SearchService {

  private searchResultSource = new BehaviorSubject<PropertySearchResult>({ page:0,pageSize:0,count:0,results:[],searchType:'',searchTerm:'' });
  searchResult$ = this.searchResultSource.asObservable();

  constructor(@Inject('_') private _, private http: Http) {}

  basicSearch(term: string, page?: number): Observable<any> {

    let currentPage = page || 1;

    return this.http.get(API_CONFIG.base + API_CONFIG.propertyApi.base + '/search/' + term + '?$page=' + currentPage + '&$pageSize=10')
      .map(res => {

        let response = res.json();

        if('page' in response && 'pageSize' in response && 'count' in response && 'results' in response) {
          response.searchType = 'basic';
          response.searchTerm = term;
          return response;
        }
        else {
          return response;
        }
      });
  }

  advancedSearch(terms: Object, page?: number, pageSize?: number): any {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let payLoad = {query:terms};

    if(page && page >= 1) {
      payLoad['page'] = page;
    };

    if(pageSize && pageSize >= 1) {
      payLoad['pageSize'] = pageSize;
    }
    else {
      payLoad['pageSize'] = 10;
    }

    return this.http.post(API_CONFIG.base + API_CONFIG.propertyApi.base + '/search-advanced', JSON.stringify(payLoad), options)
      .map(res => {

        let response = res.json();
        response.searchType = 'advanced';
        response.searchTerm = terms;
        return response;
      });
  }

  setSearchResults(_searchResult: PropertySearchResult): void {
    this.searchResultSource.next(_searchResult);
  }
  
  searchPropertiesByState(stateId, searchTerm): Observable<Response> {
    return this.http.get(API_CONFIG.base + API_CONFIG.propertyApi.base + '/search-by-state/' + stateId + '/' + searchTerm);
  }

    searchCompaniesByName(searchTerm): Observable<Response> {
        return this.http.get(API_CONFIG.base + API_CONFIG.companyApi.base + '/search/' + searchTerm)
            .map(res => {return res.json();});
    }
}
