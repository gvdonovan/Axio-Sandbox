import {Injectable} from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

import {FactoryService} from '../shared/services';
import {Property} from '../shared/interfaces';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

import {API_CONFIG} from '../shared/config';

@Injectable()
export class PropertyService {

  constructor(
  	public factoryService: FactoryService,
  	private http: AuthHttp
	) { }

  getProperty(id: string): Observable<Property> {
    return this.http.get(API_CONFIG.base + API_CONFIG.propertyApi.base + '/summary/' + id)
      .map(
        res => {
          return this.factoryService.createProperty(res.json());
        }
      );
  }
}
