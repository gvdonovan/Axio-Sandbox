
/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin  = require('copy-webpack-plugin');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const autoprefixer = require('autoprefixer');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');

var metadata = {
  title: 'AW 1.0',
  baseUrl: '/',
  host: 'localhost',
  port: 3050,
  ENV: ENV
};
/*
 * Config
 */
module.exports = {
  // static data for index.html
  metadata: metadata,
  // for faster builds use 'eval'
  devtool: 'eval',
  debug: true,
  // cache: false,

  // our angular app
  entry: { 'polyfills': './src/polyfills.ts', 'main': './src/main.ts' },

  // Config for our build files
  output: {
    path: root('dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  resolve: {
    // ensure loader extensions match
    extensions: prepend(['.ts','.js','.json','.css','.html'], '.async') // ensure .async.ts etc also works
  },

  module: {
    preLoaders: [
      // { test: /\.ts$/, loader: 'tslint-loader', exclude: [ root('node_modules') ] },
      // TODO(gdi2290): `exclude: [ root('node_modules/rxjs') ]` fixed with rxjs 5 beta.2 release
      { test: /\.js$/, loader: "source-map-loader", exclude: [ root('node_modules/rxjs') ] }
    ],
    loaders: [
      // Support Angular 2 async routes via .async.ts
      { test: /\.async\.ts$/, loaders: ['es6-promise-loader', 'ts-loader'], exclude: [ /\.(spec|e2e)\.ts$/, root('node_modules') ] },

      // Support for .ts files.
      { test: /\.ts$/, loader: 'ts-loader', exclude: [root('node_modules'), /\.(spec|e2e|async)\.ts$/ ] },

      // Support for *.json files.
      { test: /\.json$/,  loader: 'json-loader', exclude: [root('node_modules')]},

      // Support for CSS as raw text
      { test: /\.css$/,   loader: 'raw-loader', exclude: [root('node_modules')]},

      // support for .html as raw text
      { test: /\.html$/,  loader: 'raw-loader', exclude: [root('node_modules'), root('src/index.html') ] },

      { test: /\.scss$/, loaders: ['raw-loader', 'sass-loader'], exclude: [root('node_modules')] },

      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000&name=[name].[ext]', exclude: [root('node_modules')] },

      // Bootstrap 4
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' }

      // if you add a loader include the resolve file extension above
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "node_modules/")]
  },


  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.CommonsChunkPlugin({ name: 'polyfills', filename: 'polyfills.bundle.js', minChunks: Infinity }),
    // static assets
    new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ]),
    // generating html
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // replace
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(metadata.ENV),
        'NODE_ENV': JSON.stringify(metadata.ENV)
      }
    }),
    new ProvidePlugin({
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      $: 'jquery',
      'window.Tether': 'tether',
      Util: 'util'
    })
  ],

  // Other module loader config
  tslint: {
    emitErrors: true,
    failOnHint: true,
    resourcePath: 'src'
  },
  // our Webpack Development Server config
  devServer: {
    port: metadata.port,
    host: metadata.host,
    // contentBase: 'src/',
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 }
  },
  // we need this due to problems with es6-shim
  node: {global: 'window', progress: false, crypto: 'empty', module: false, clearImmediate: false, setImmediate: false}
};

// Helper functions

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function prepend(extensions, args) {
  args = args || [];
  if (!Array.isArray(args)) { args = [args] }
  return extensions.reduce(function(memo, val) {
    return memo.concat(val, args.map(function(prefix) {
      return prefix + val
    }));
  }, ['']);
}
function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return root.apply(path, ['node_modules'].concat(args));
}
