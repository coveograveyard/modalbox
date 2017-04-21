'use strict';

const sass = require('node-sass');
const fs = require('fs');

sass.render({
  file: 'src/modalBox.scss'
}, (err, result)=> {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  fs.writeFile('bin/modalBox.css', result.css, function (err) {
    if (!err) {
      console.log('CSS created');
      process.exit(0);
    }
  });
});
