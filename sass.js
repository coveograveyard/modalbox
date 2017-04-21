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
  const str = result.css.toString()
  const start = str.indexOf('@font-face');
  const end = str.indexOf('format("truetype"); }') + 'format("truetype"); }'.length;
  const cleaned = str.substr(0, start) + str.substr(end + 1);
  fs.writeFile('bin/modalBox.css', cleaned, function (err) {
    if (!err) {
      console.log('CSS created');
      process.exit(0);
    }
  });
});
