const LicensePlugin = require('webpack-license-plugin');

module.exports = {
  plugins: [
    new LicensePlugin()
  ],
  node: {
    fs: 'empty'
  }
};
