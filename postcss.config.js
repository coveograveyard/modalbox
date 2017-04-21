'use strict';

module.exports = {
  plugins: [
    require('postcss-modules')({
      generateScopedName: function (name, filename, css) {
        if (name.indexOf('coveo') == -1) {
          return `coveo-${name}`;
        }
        return name;
      }
    })
  ]
};
