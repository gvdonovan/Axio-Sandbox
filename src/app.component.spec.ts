import {
  it,
  inject,
  beforeEachProviders,
} from '@angular/core/testing';

// Load the implementations that should be tested
import {App} from './app.component';

describe('App Component', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEachProviders(() => [
    App
  ]);

  it('should have a title', inject([ App ], (app) => {
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
