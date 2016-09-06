'use strict';

var sass = require('node-sass');
var cssmin = require('cssmin');

function wrapValue(value) {
  return '.test { content: ' + value + ' };';
}

function unwrapValue(value) {
  return value.replace('.test{content:', '').replace('}', '');
}

function scssMapToJsonArray(value) {

  var json = value;

  // Every scss map key and value to array
  var mapArray = json.split('\n');

  // remove first and last from array if ( and )
  if ( mapArray[0] === '(' ) {
    mapArray.splice(0, 1);
  }
  if ( mapArray[mapArray.length-1] === ')' ) {
    mapArray.splice(mapArray.length-1, 1);
  }


  var scssMap = {};


  // Build object of scss map.
  mapArray.forEach(function(mapLine) {
    var mapValuesArray = mapLine.split(':');

    // Split single scss map line into array.
    // And build object based on this values.
    // So. 'border : #FFF,' becomes:
    // [0] = 'border' and [1] = #FFF,

    if (mapValuesArray[1] != undefined) {
      var key = mapValuesArray[0];
      var val = mapValuesArray[1];



      // Remove leading whitespace
      key = key.replace(/^ +/gm, '');

      // Remove whitespace at end of line
      key = key.replace(/[ \t]+$/gm, '');


      // Remove last ,
      val = val.replace(/\,(?=[^,]*$)/, '');

      // Remove leading whitespace
      val = val.replace(/^ +/gm, '');

      // Remove whitespace at end of line
      val = val.replace(/[ \t]+$/gm, '');


      scssMap[key] = val;
    }

  });

  json = JSON.stringify(scssMap);

  return json;
}

var Compile = {
  fromString: function(value) {

    // It's a scss map. Convert the map to a json array with values.
    if ( value.startsWith('(') &&  value.endsWith(')') ) {
      value = scssMapToJsonArray(value);
    }

    return value;
  }
};

if (process.env.NODE_ENV === 'test') {
  Compile.wrapValue = wrapValue;
  Compile.unwrapValue = unwrapValue;
}

module.exports = Compile;
