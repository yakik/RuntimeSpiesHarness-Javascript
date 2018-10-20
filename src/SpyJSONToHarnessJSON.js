
var spyJSONToHarnessJSON = function(spyJSON) {
    var harnessJSON = []
    spyJSON.variables.forEach(variable => {
        harnessJSON.push(getVariableHarness(variable))
    });
    spyJSON.functions.forEach(functionSpy => {
        harnessJSON.push(getFunctionHarness(functionSpy))
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

var getFunctionHarness = function(functionSpyJSON){
    var returnedJSON = {
        functionHarness: [
            { variableDefinition: getFunctionDBDefinition(functionSpyJSON) },
            { variableDefinition: { name: functionSpyJSON.name + '_counter', value: 0 } },
            { functionDefinition: getFunctionDefinition(functionSpyJSON) }]
    }
    return returnedJSON
}

var getFunctionDefinition = function (functionSpyJSON) {
    var returnedJSON = {
            name: functionSpyJSON.name,
            content: [
                { validateInputAndGetOutput: { function: functionSpyJSON.name, DB: functionSpyJSON.name + '_DB', counter: functionSpyJSON.name + '_counter', toVariable: 'output' } },
                { increaseCounterByOne: { counter: functionSpyJSON.name + '_counter' } },
                { returnOutput: { returnedVariable: 'output' } }]
        }
        return returnedJSON
}

var getFunctionDBDefinition=function(functionSpyJSON){
    var returnedJSON = { name: functionSpyJSON.name + '_DB', value:[] }
    functionSpyJSON.traffic.forEach(call => {
        returnedJSON.value.push({ arguments: call.arguments, returnValue: call.returnValue })
    })
    return returnedJSON
}

module.exports = spyJSONToHarnessJSON