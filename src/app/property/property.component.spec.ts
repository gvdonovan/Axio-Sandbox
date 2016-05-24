import { injectAsync, it, beforeEachProviders} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import { PropertyComponent} from './property.component';
import {HTTP_PROVIDERS} from '@angular/http';
import * as moment from 'moment';
import {provide} from '@angular/core';
import {RouteParams} from '@angular/router-deprecated';

describe('property component', () => {

  beforeEachProviders(() => [
    HTTP_PROVIDERS,
    provide('moment', {useValue: moment}),
    provide(RouteParams, {
      useFactory: function(): RouteParams {
        return new RouteParams({ 'propertyId': '1' });
      }
    })
  ]);

  it('should have property page title', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(PropertyComponent).then((fixture) => {
      let propertyComp = fixture.componentInstance,
          element = fixture.nativeElement;

      expect(element.querySelector('h1')).toBe(null);
    });
  }));
});
