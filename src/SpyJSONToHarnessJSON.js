
var spyJSONToHarnessJSON = function(spyJSON) {
    var harnessJSON = []
    spyJSON.variables.forEach(variable => {
        harnessJSON.push(getVariableHarness(variable))
    });
    return harnessJSON
}

var getVariableHarness = function(variable){
    var returnedJSON = {
        variableDefinition: {
            name: variable.name,
            value: variable.values.filter(value => value.timing == 'Initial')[0].value
        }
    }
    
    return returnedJSON
}


module.exports = spyJSONToHarnessJSON