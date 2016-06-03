import {Injectable} from '@angular/core';
import { Http } from '@angular/http';

import {FactoryService} from '../../shared/services';
import {Company} from '../../shared/interfaces';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

import {API_CONFIG} from '../../shared/config';
import {HttpClient} from "../../shared/services/http-client.service";

@Injectable()
export class CompanyService {

    constructor(
        public factoryService: FactoryService,
        private http: HttpClient
    ) { }

    getCompany(id: string): Observable<Company> {
        return this.http.get(API_CONFIG.base + API_CONFIG.companyApi.base + '/summary/' + id)
            .map(
                res => {
                    return this.factoryService.createCompany(res.json());
                }
            );
    }

    /**
     *
     * Addresses
     * */
    
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
        return this.http.put(API_CONFIG.base + API_CONFIG.companyApi.base + '/address/update',JSON.stringify({companyId: id, address: address}));
    }

    createAddress(id: number, address: any): Observable<any> {
        return this.http.post(API_CONFIG.base + API_CONFIG.companyApi.base + '/address/create', 
            JSON.stringify({companyId: id, companyAddressTypeId: 1, address: address}));
    }


    /**
     *
     * Phone numbers
     * */
    getPhoneNumber(id: string): Observable<any> {
        return this.http.get(API_CONFIG.base + API_CONFIG.companyApi.base + '/' + id + '/phoneNumber')
            .map(
                res => {
                    let response = res.json();
                    if(response.length > 0) {
                        return response[0].phoneNumber || {};
                    }
                    else {
                        return {};
                    }
                }
            )
    }
    
    editPhoneNumber(id: number, phoneNumber: any): Observable<any> {
        return this.http.put(API_CONFIG.base + API_CONFIG.companyApi.base + '/phoneNumber/update',JSON.stringify({companyId: id, phoneNumber: phoneNumber}));
    }

    createPhoneNumber(id: number, phoneNumber: any): Observable<any> {
        return this.http.post(API_CONFIG.base + API_CONFIG.companyApi.base + '/phoneNumber/create',
            JSON.stringify({companyId: id, companyPhoneNumberTypeId: 1, phoneNumber: phoneNumber}));
    }

    /**
     * web address
     * */
    getWebAddress(id: string): Observable<any> {
        return this.http.get(API_CONFIG.base + API_CONFIG.companyApi.base + '/' + id + '/webAddress')
            .map(
                res => {
                    let response = res.json();
                    if(response.length > 0) {
                        return response[0].webAddress || {};
                    }
                    else {
                        return {};
                    }
                }
            )
    }

    editWebAddress(id: number, webAddress: any): Observable<any> {
        return this.http.put(API_CONFIG.base + API_CONFIG.companyApi.base + '/webAddress/update',JSON.stringify({companyId: id, webAddress: webAddress}));
    }

    createWebAddress(id: number, webAddress: any): Observable<any> {
        return this.http.post(API_CONFIG.base + API_CONFIG.companyApi.base + '/webAddress/create',
            JSON.stringify({companyId: id, companyWebAddressTypeId: 1, webAddress: webAddress}));
    }
}