import {Injectable} from '@angular/core';
import { Http } from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

import {API_CONFIG} from '../../shared/config';
import {HttpClient} from "../../shared/services";

@Injectable()
export class PropertyService {

    constructor(
        private http: HttpClient
    ) { }

    getProperty(id: string): Observable<any> {
        return this.http.get(API_CONFIG.base + API_CONFIG.propertyApi.base + '/summary/' + id)
            .map(
                res => {
                    return res.json();
                }
            );
    }

    addCompanies(owners: any[], managers: any[]): Observable<any> {
        return this.http.post(API_CONFIG.base + API_CONFIG.propertyApi.base + '/companies',
            JSON.stringify({owners:owners, managers: managers, architects : [], contractors: [], developers: []}));
    }
}
