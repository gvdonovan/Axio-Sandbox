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
    
    getAddress(id: string): Observable<any> {
        return this.http.get(API_CONFIG.base + API_CONFIG.companyApi.base + '/' + id + '/address')
            .map(
                res => {
                    let response = res.json();
                    if(response.length > 0) {
                        return response[0].address || {};
                    }
                    else {
                        return {};
                    }
                }
            )
    }

    editAddress(id: number, address: any): Observable<any> {
        return this.http.put(API_CONFIG.base + API_CONFIG.companyApi.base + '/address/update',JSON.stringify({companyId: id, address: address}))
            .map(
                res => {
                    return res.json()
                }
            )
    }

    createAddress(id: number, address: any): Observable<any> {
        return this.http.post(API_CONFIG.base + API_CONFIG.companyApi.base + '/address/create', 
            JSON.stringify({companyId: id, companyAddressTypeId: 1, address: address}))
            .map(
                res => {return res.json()}
            )
    }
}