import {
  it,   
  inject,
  beforeEachProviders,
} from '@angular/core/testing';

// Load the implementations that should be tested
import {AppComponent} from './app.component';

describe('App Component', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    AppComponent
  ]);

  it('should have a title', inject([ AppComponent ], (app) => {
    expect(app.title).toEqual('Axio Workspace');
  }));

  // sanity test
  it('should always pass', inject([], () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
  }));

  // sanity test
  // it('should always fail', inject([], () => {
  //   expect(true).toBe(false);
  //   expect(1 + 1).toBe(3);
  // }));
});
