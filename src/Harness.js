var GlobalVariableMock = require('./NonFunctionMock')
var HarnessFactory = require('./HarnessFactory')
var FunctionMock = require('./FunctionMock')
var VariableLiteral = require('variable-literal')

const mockRepositoryDataName = 'mockRepositoryData'
class Harness {
    constructor(harnessName) {
        this.harnessName = harnessName
        this.globalVariablesMocks = new Map()
        this.functionMocks = new Map()
    }

    static getHarnessCode(harnessName, runtimeSpyJSON) {
        var harnessFactory = new HarnessFactory(harnessName, runtimeSpyJSON)
        return harnessFactory.getHarnessCode()
    }

    setMockRepositoryData(mockRepositoryData) {
        this.mockRepositoryData = mockRepositoryData
    }

    addGlobalVariableMock(variableName, dataMap) {
        this.globalVariablesMocks.set(variableName, new GlobalVariableMock(variableName, this.harnessName, dataMap))
    }

    getLiteralAndCyclic(variable, name) {
		return VariableLiteral.getVariableLiteral(variable).getLiteralAndCyclicDefinition(name)
}

    updateVariablesByTag(tag, evalCodeFunction) {
        this.globalVariablesMocks.forEach(variable => {
            var definition = variable.getDefinitionByTag(tag)
            if (definition != undefined)
                evalCodeFunction(definition)
        })
    }

    addFunctionMock(functionName) {
        this.functionMocks.set(functionName,
            new FunctionMock(functionName, this.harnessName, this.mockRepositoryData[functionName]))
    }

    callFunctionSpy(functionName, callArguments, evalCodeFunction) {
        var functionMock = this.functionMocks.get(functionName)
        var output = functionMock.callFunction(callArguments)
        this.updateVariablesByTag(output.tag, evalCodeFunction)
        return output.output
    }


}

module.exports = Harness