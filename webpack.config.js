const Path = require('path');
const { JavascriptWebpackConfig, CssWebpackConfig } = require('@silverstripe/webpack-config');

const ENV = process.env.NODE_ENV;
const PATHS = {
  ROOT: Path.resolve(),
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist'),
};

const frontEndJsConfig = new JavascriptWebpackConfig('js', PATHS, 'silverstripe/ckan-registry')
  .setEntry({
    bundle: `${PATHS.SRC}/bundles/bundle.js`,
  })
  .getConfig();

// Don't apply any externals, as this js will be used on the front-end.
frontEndJsConfig.externals = {};

const config = [
  // Main JS bundle
  new JavascriptWebpackConfig('js', PATHS, 'silverstripe/ckan-registry')
    .setEntry({
      'bundle-admin': `${PATHS.SRC}/bundles/bundle-admin.js`,
    })
    .getConfig(),
  // Frontend JS bundle
  frontEndJsConfig,
  // sass to css
  new CssWebpackConfig('css', PATHS)
    .setEntry({
      'bundle-admin': `${PATHS.SRC}/styles/bundle-admin.scss`,
      bundle: `${PATHS.SRC}/styles/bundle.scss`,
    })
    .getConfig(),
];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : config;
