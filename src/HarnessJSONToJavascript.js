var HarnessJSONToJavascript = function (harnessJSON) {
    var javascriptCode = ''
    harnessJSON.forEach(harnessPart => {
        javascriptCode += getHarnessCode(harnessPart)
    })
    return javascriptCode
}

var getHarnessCode = function (harnessJSON) {
    var javascriptCode = ''
    for (var propertyName in harnessJSON) {
        switch (propertyName) {
            case 'functionHarness':
                javascriptCode += getCodeForFunctionHarness(harnessJSON[propertyName])
                break
            case 'variableDefinition':
                javascriptCode += getCodeForVariableDefinition(harnessJSON[propertyName])
                break
            case 'functionDefinition':
                javascriptCode += getCodeForFunctionDefinition(harnessJSON[propertyName])
                break
            case 'validateInputAndGetOutput':
                javascriptCode += getCodeForValidateInputAndGetOutput(harnessJSON[propertyName])
                break
            case 'increaseCounterByOne':
                javascriptCode += getCodeForIncreaseCounterByOne(harnessJSON[propertyName])
                break
            case 'returnOutput':
                javascriptCode += getCodeForReturnOutput(harnessJSON[propertyName])
                break
            default:
                console.log('Something\'s wrong. switch didn\'t catch harnessJSON type '+propertyName)
        }
    }
    return javascriptCode
}

var getCodeForFunctionHarness = function (harnessJSON) {
    return HarnessJSONToJavascript(harnessJSON)
 }

var getCodeForVariableDefinition=function(harnessJSON) {
    var javascriptCode = 'var '+ harnessJSON.name+' = '+JSON.stringify(harnessJSON.value)+'\n'
    return javascriptCode
 }

var getCodeForFunctionDefinition=function(harnessJSON) {
    var javascriptCode = 'var ' + harnessJSON.name + ' = function(){\n' +
    HarnessJSONToJavascript(harnessJSON.content)+'\n}\n'
    return javascriptCode
 }

var getCodeForValidateInputAndGetOutput=function(harnessJSON) {
    var javascriptCode = 'expect(Array.from(arguments)).deep.equal('+harnessJSON.DB+'['+harnessJSON.counter+'].arguments)\n'
    javascriptCode+= 'var ' + harnessJSON.outputVariable + ' = ' +
        harnessJSON.DB+'['+harnessJSON.counter+'].returnValue\n'
    return javascriptCode
}
 
var getCodeForIncreaseCounterByOne=function(harnessJSON) {
   
    return harnessJSON.counter+'++\n'
 }

var getCodeForReturnOutput=function(harnessJSON) {
    return 'return '+harnessJSON.returnedVariable
 }


module.exports = HarnessJSONToJavascript