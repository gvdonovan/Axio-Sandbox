/*
 * Providers provided by Angular
 */

import 'jquery';
import 'tether';
import 'bootstrap';
import 'pace';

import * as bl from 'bootstrap-layout';

import {provide, enableProdMode} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {ELEMENT_PROBE_PROVIDERS} from '@angular/platform-browser';
import {ROUTER_PROVIDERS} from '@angular/router';
import {LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Http, HTTP_PROVIDERS } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import * as moment from 'moment';
import * as _ from 'lodash';

const ENV_PROVIDERS = [];

if ('production' === process.env.ENV) {
  enableProdMode();
} else {
  ENV_PROVIDERS.push(ELEMENT_PROBE_PROVIDERS);
}

import {App} from './app.component';
import {ConfigService} from './app/workspace/config';
import {ANGULAR2_GOOGLE_MAPS_PROVIDERS} from "angular2-google-maps/core";
import {FactoryService} from "./app/shared/services/factory.service";
import {PropertyService} from "./app/property/property.service";
import {SearchService} from "./app/shared/services/search.service";

bootstrap(App, [
    ConfigService,
    ENV_PROVIDERS,
    HTTP_PROVIDERS,
    ROUTER_PROVIDERS,
    ANGULAR2_GOOGLE_MAPS_PROVIDERS,
    FactoryService,
    PropertyService,
    SearchService,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    provide("moment", {useValue:moment}),
    provide("_", {useValue:_}),
    provide(AuthHttp, {
        useFactory: (http: Http) => {
            return new AuthHttp(new AuthConfig({
                tokenGetter: () => localStorage.getItem('auth_token')
            }), http);
        },
        deps: [Http]
    })
])
.catch(err => console.error(err));

