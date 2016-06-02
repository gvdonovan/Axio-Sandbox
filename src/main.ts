/*
 * Providers provided by Angular
 */

import 'jquery';
import 'tether';
import 'bootstrap';
import 'pace';

require('simplebar/dist/simplebar.min.js');

import {provide, enableProdMode} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ELEMENT_PROBE_PROVIDERS} from '@angular/platform-browser';
import {ROUTER_PROVIDERS} from '@angular/router';
import {LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {AuthHttp, AuthConfig} from 'angular2-jwt';

import * as moment from 'moment';
import * as _ from 'lodash';

const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
    enableProdMode();
} else {
    ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}

import {AppComponent} from './app.component';
import {ANGULAR2_GOOGLE_MAPS_PROVIDERS} from "angular2-google-maps/core";
//import {PropertyService} from "./app/property/property.service";
import {SearchService, SidebarService, FactoryService, PropertySearchFormStore} from "./app/shared/services";

bootstrap(AppComponent, [
    ENV_PROVIDERS,
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    FactoryService,
//  PropertyService,
    SidebarService,
    PropertySearchFormStore,
    SearchService,
    provide(LocationStrategy, {useClass: PathLocationStrategy}),
    provide("moment", {useValue: moment}),
    provide("_", {useValue: _}),
    provide(AuthHttp, {
        useFactory: (http:Http) => {
            return new AuthHttp(new AuthConfig({
                tokenGetter: () => localStorage.getItem('auth_token')
            }), http);
        },
        deps: [Http]
    })
])
    .catch(err => console.error(err));

