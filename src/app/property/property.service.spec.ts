import {PropertyService} from './property.service';
import {beforeEachProviders, inject, describe, expect} from '@angular/core/testing';
import {FactoryService} from '../shared/services/factory.service';

describe('property service', () => {

  beforeEachProviders(() => [
    FactoryService,
    PropertyService
  ]);
});
