const mockRepositoryDataName = 'mockRepositoryData'
class HarnessFactory {
	constructor(harnessName,runtimeSpyJSON){
	//	harnessName, globalVariablesSpies, functionSpies, resultLiteral, testFunctionCall) {
		this.harnessName = harnessName
		this.variables = runtimeSpyJSON.variables
		this.functions = runtimeSpyJSON.functions
		this.resultLiteral = runtimeSpyJSON.resultLiteral
		this.testedFunctionCall = runtimeSpyJSON.testedFunctionCall
	}

	getHarnessCode() {
		var harnessText = 'var myHarness = new Harness(\'' + this.harnessName + '\')\n'
		harnessText += this.getDataRepositoryText()
		harnessText += 'myHarness.setMockRepositoryData(' + mockRepositoryDataName + ')\n'
		harnessText += this.getVariableMocksText()
		harnessText += this.getFunctionMocksText()
		if (this.testedFunctionCall != "EMPTY") {
			if (this.resultLiteral == undefined)
				harnessText += this.testedFunctionCall
			else {
				harnessText += 'expect('+this.harnessName+'.getLiteralAndCyclic(' + this.testedFunctionCall + ',\'result\')' +
					').equals(\'' + this.resultLiteral.replace(/\'/g, '\\\'').replace(/\n/g, '\\n') + '\')\n'
			}
		}
		return harnessText
	}

	getDataRepositoryText() {
		var repositoryText = 'var ' + mockRepositoryDataName + ' = {}\n'
		this.functions.forEach(functionSpy => {
			repositoryText += mockRepositoryDataName + '[\'' + functionSpy.name.replace(/\'/g, '\\\'') + '\']' +
				' = ' + functionSpy.values + '\n'
		})

		return repositoryText
	}

	getFunctionMocksText() {
		var mocksText = ''
		this.functions.forEach((functionSpy) => {
			mocksText += this.harnessName + '.addFunctionMock(\'' + functionSpy.name.replace(/\'/g, '\\\'') + '\')\n'
			mocksText += functionSpy.name + '= function(){\n' +
				'var returnValue =  ' + this.harnessName + '.callFunctionSpy(\'' + functionSpy.name.replace(/\'/g, '\\\'') + '\',' +
				'arguments,' +
				'function(codeToEval){eval(codeToEval)})\n' +
				'if (returnValue!=\'NOVALUERETURNED\')' +
				'return eval(returnValue)\n' +
				'}\n'
		})

		return mocksText
	}


	getVariableMocksText() {
		var mocksText = ''
		this.variables.forEach((variable) => {
			mocksText += variable.name + '_DB = ' + variable.values + '\n'
			mocksText += 'var ' + variable.name + '\n'
			mocksText += this.harnessName + '.addGlobalVariableMock(' +
				'\'' + variable.name + '\',' +
				variable.name + '_DB)\n'

		})
		mocksText += this.harnessName + '.updateVariablesByTag(\'Initial\',' +
			'function(codeToEval){eval(codeToEval)})\n'
		return mocksText
	}

}

module.exports = HarnessFactory