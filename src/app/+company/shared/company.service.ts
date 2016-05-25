import {Injectable} from '@angular/core';
import { Http } from '@angular/http';

import {FactoryService} from '../../shared/services';
import {Company} from '../../shared/interfaces';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

import {API_CONFIG} from '../../shared/config';

@Injectable()
export class CompanyService {

    constructor(
        public factoryService: FactoryService,
        private http: Http
    ) { }

    getCompany(id: string): Observable<Company> {
        return this.http.get(API_CONFIG.base + API_CONFIG.companyApi.base + '/summary/' + id)
            .map(
                res => {
                    return this.factoryService.createCompany(res.json());
                }
            );
    }
}
