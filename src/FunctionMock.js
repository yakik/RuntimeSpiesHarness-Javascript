
var chai = require('chai')
var expect = chai.expect
if (module != undefined)
var VariableLiteral = require('variable-literal')

class FunctionMock {
    constructor(functionName, harnessName, mockDataSource) {
       this.harnessName = harnessName
        this.functionName = functionName
        this.mockDataSource = mockDataSource
        this.callIndex = 0
    }

    static getSmartMock(functionName, mockDataSource) {
        var mock = new FunctionMock(functionName, mockDataSource)
        return mock
    }

    callFunction(callArguments) {
        var output = {}
            this.assertInput(callArguments, this.callIndex)
        output.output = this.getOutput(this.callIndex)
        output.tag = this.functionName+'_'+this.callIndex
        
        this.callIndex++
            
        return output
    }

   

    assertInput(callArguments, callIndex) {
        expect(VariableLiteral.getVariableLiteral(this.mockDataSource.input[callIndex]).getLiteral()).
            equals(VariableLiteral.getVariableLiteral(Array.from(callArguments)).getLiteral())
    }

    getOutput(callIndex) {
        return this.mockDataSource.output[callIndex]
    }

}
module.exports = FunctionMock
