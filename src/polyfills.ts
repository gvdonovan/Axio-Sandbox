// Polyfills

import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

// Typescript emit helpers polyfill
import 'ts-helpers';

if ('production' === process.env.ENV) {
  // In production Reflect with es7-reflect-metadata/reflect-metadata is added
  

} else {
  // In production Reflect with es7-reflect-metadata/reflect-metadata is added

  // by webpack.prod.config ProvidePlugin
  /* tslint:disable */
  Error['stackTraceLimit'] = Infinity;
  /* tslint:enable */
  require('zone.js/dist/long-stack-trace-zone');
}

// For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
// Also see custom_typings.d.ts as you also need to do `typings install x` where `x` is your module
