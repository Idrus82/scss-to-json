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
  var jsonArray = value;

  // replace first ( with {
  jsonArray = jsonArray.replace(/\(/, '{');

  // replaced last ) with }
  jsonArray = jsonArray.replace(/[)]$/, '}');

  // remove qoutes (singles and doubles)
  jsonArray = jsonArray.replace(/\s*\'\s*/g, '');
  jsonArray = jsonArray.replace(/\s*\"\s*/g, '');

  // replace first { with {"
  jsonArray = jsonArray.replace(/\{/, '{"');

  // replace last } with "}
  jsonArray = jsonArray.replace(/[}]$/, '"}');

  // replace : with ":"
  jsonArray = jsonArray.replace(/[:]/g, '":"');

  // replace , with ","
  jsonArray = jsonArray.replace(/[,]/g, '","');



  // Get part of string  between var( and first )
  var re = /var\([^"][^)]*\)/g;
  re.exec(jsonArray);
  var scssVarFunction = RegExp.lastMatch;

  // Remove qoutes.
  scssVarFunction = scssVarFunction.replace(/["']/g, "");

  // Replaced part that is stripped from qoutes with orignial part with qoutes.
  jsonArray = jsonArray.replace(re, scssVarFunction);



  return jsonArray;
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
