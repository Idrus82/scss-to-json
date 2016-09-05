'use strict';

var Processor = require('./src/processor');

function scssToJson(path, options) {
  console.log('\n\n---------------------------------------------------------------------------------');
  console.log('START');
  console.log('---------------------------------------------------------------------------------\n\n');

  var processor = new Processor(path, options);
  return processor.object;
}

module.exports = scssToJson;
