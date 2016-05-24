import {beforeEachProviders, inject, describe, it, expect} from '@angular/core/testing';
import {FactoryService} from './factory.service';
import {properties} from '../../property/mock-property';

describe('factory service', () => {

  let mockState = {
    id: 1,
    name: 'Texas',
    shortName: 'TX'
  };

  let mockProperty = properties[0];

  beforeEachProviders(() => [
    FactoryService
  ]);

  it('should create State', inject([FactoryService], (factoryService) => {
    let state = factoryService.createState(mockState);
    expect(state.id).toBe(mockState.id);
  }));

  it('should create Property', inject([FactoryService], (factoryService) => {
    let property = factoryService.createProperty(mockProperty);
    expect(property.id).toBe(mockProperty.id);
    expect(property.name).toBe(mockProperty.name);
  }));
});
