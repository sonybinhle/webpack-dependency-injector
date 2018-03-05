<div align="center"><strong>Status</strong></div>

<div align="center">
  <a href="https://david-dm.org/sonybinhle/webpack-dependency-injector" title="dependencies status">
    <img src="https://david-dm.org/sonybinhle/webpack-dependency-injector/status.svg"/>
  </a>
  
  <a href="https://travis-ci.org/sonybinhle/webpack-dependency-injector.svg?branch=master">
    <img src="https://travis-ci.org/sonybinhle/webpack-dependency-injector.svg?branch=master" alt="Build Status" />
  </a>
    
  <a href='https://coveralls.io/github/sonybinhle/webpack-dependency-injector?branch=master'>
    <img src='https://coveralls.io/repos/github/sonybinhle/webpack-dependency-injector/badge.svg?branch=master' alt='Coverage Status' />
  </a>

</div>

# webpack-dependency-injector v1.0.0

The utility for doing dependency injection in javascript, sass build to support multiple bundles, themes.

## Why webpack-dependency-injector?

Usually on user interactive web app, we want to run the A/B test or support multiple themes for different partners. There will be a solution to embed version A, B to our app which is `if query.version equal A then render A else render B`. In one version, we may be required to do the A/B test in multiple places(header, footer, legal text, submit button, ....) and by following the first solution there will be few drawbacks:

* If we have multiple version, version code will be bundled along with main version and give us the final large bundle.
* There will not be a clear separate between individual version code, bug on one version might affect another version.

## Install:

```shell
npm i webpack-dependency-injector --save-dev
```

## Usage:

```javascript
// webpack.js
const path = require('path');
const WebpackDi = require('webpack-dependency-injector');

const webpackDiPlugin = new WebpackDi({
  source: path.resolve(__dirname, 'src'), // Source path for injected files
  excludes: [/src\/versions/], // prevent run dependency injection in injected path to avoid accident loop import 
  map: {
      //       regex        : injectedPath
      "src/styles/variables": "versions/vio/styles/variables.scss",
      "src/components/Logo$": "versions/vio/components/Logo",
  },
});

const sassLoader = {
  loader: 'sass-loader',
  options: {
    importer: webpackDiPlugin.sassImporter,
  },
}; 

module.exports = {
  entry: ['./src'],
  module: {
    rules: [
      { 
        test: /\.scss$/,
        include: /src/,
        use: [
          'style-loader',
          'css-loader',
          sassLoader,
        ],
      },
    ],
  },
  plugins: [
    webpackDiPlugin,
  ],
};
```