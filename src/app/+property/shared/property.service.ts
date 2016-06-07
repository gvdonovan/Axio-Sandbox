import {Injectable} from '@angular/core';
import { Http } from '@angular/http';

import {FactoryService} from '../../shared/services';
import {Property} from '../../shared/interfaces';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

import {API_CONFIG} from '../../shared/config';
import {HttpClient} from "../../shared/services";

@Injectable()
export class PropertyService {

    constructor(
        public factoryService: FactoryService,
        private http: HttpClient
    ) { }

    getProperty(id: string): Observable<Property> {
        return this.http.get(API_CONFIG.base + API_CONFIG.propertyApi.base + '/summary/' + id)
            .map(
                res => {
                    return this.factoryService.createProperty(res.json());
                }
            );
    }

    addCompanies(owners: any[], managers: any[]): Observable<any> {
        return this.http.post(API_CONFIG.base + API_CONFIG.propertyApi.base + '/companies',
            JSON.stringify({owners:owners, managers: managers, architects : [], contractors: [], developers: []}));
    }
}
