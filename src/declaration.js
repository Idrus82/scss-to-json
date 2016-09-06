'use strict';

var Value = require('./value');
var Variable = require('./variable');

var ASSIGNMENT_OPERATOR = ':';

function hasGlobalFlag(value) {
  var regex = new RegExp('\\!global(\\s|\$|\\W)');
  return !!value.match(regex);
}

function Declaration(line, declarationStore) {
  this._parse(line, declarationStore);
}

Declaration.prototype = {
  _parse: function(line, declarationStore) {




    if ( line.indexOf('@import') !== -1 ) {

      var importUrl = line.toString();
      importUrl = importUrl.split('@import')[1];
      // Why can't i do regex here?

      this.variable = new Variable('@import');
      this.value = {"value": importUrl};
      this.global = false;

    } else {

      var assignmentIndex = line.indexOf(ASSIGNMENT_OPERATOR);
      var assignedVariable = line.substring(0, assignmentIndex).trim();
      var assignedValue = line.substring(assignmentIndex + 1, line.length).trim();

      var replacedValue = declarationStore.replaceVariables(assignedValue);

      this.variable = new Variable(assignedVariable);
      this.value = new Value(replacedValue);
      this.global = hasGlobalFlag(replacedValue);


      // It's a scss map. Convert the map to a json array instead of a string
      if ( this.value.value.indexOf('{') !== -1 ) {
        this.value.value = JSON.parse(this.value.value);
      }

    }

    declarationStore.addDeclaration(this);
  }
};

module.exports = Declaration;
