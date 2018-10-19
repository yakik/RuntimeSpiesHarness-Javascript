var Harness = require('../src/Harness')
var mocha = require('mocha')
var chai = require('chai')
var expect = chai.expect

mocha.describe('Harness Factory Tests', function () {

    mocha.it('long Function name', function () {
        var runtimeSpyJSON = {
            testedFunctionCall: 'testFunction()',
            resultLiteral: undefined,
            variables: [],
            functions:[{ name: 'b.w.b', values: '{input:[[]],output:[3]}' }]
        }
        var resultCode = 'var myHarness = new Harness(\'myHarness\')\n' +
        'var mockRepositoryData = {}\n' +
        'mockRepositoryData[\'b.w.b\'] = {input:[[]],output:[3]}\n' +
        'myHarness.setMockRepositoryData(mockRepositoryData)\n' +
        'myHarness.updateVariablesByTag(\'Initial\',function(codeToEval){eval(codeToEval)})\n' +
        'myHarness.addFunctionMock(\'b.w.b\')\n' +
        'b.w.b= function(){\n' +
        'var returnValue =  myHarness.callFunctionSpy(\'b.w.b\',arguments,function(codeToEval){eval(codeToEval)})\n' +
        'if (returnValue!=\'NOVALUERETURNED\')return eval(returnValue)\n' +
        '}\n' +
        'testFunction()'
        expect(Harness.getHarnessCode('myHarness',runtimeSpyJSON)).equals(resultCode)
    })

    mocha.it('should return definitions/calling statements (no param names)', function () {
        var runtimeSpyJSON = {
            testedFunctionCall: 'testFunction()',
            resultLiteral: undefined,
            variables: [],
            functions:[]
        }
        var resultCode = 'var myHarness = new Harness(\'myHarness\')\n' +
        'var mockRepositoryData = {}\n' +
        'myHarness.setMockRepositoryData(mockRepositoryData)\n' +
        'myHarness.updateVariablesByTag(\'Initial\',function(codeToEval){eval(codeToEval)})\n' +
        'testFunction()'
        expect(Harness.getHarnessCode('myHarness',runtimeSpyJSON)).equals(resultCode)
    })


    mocha.it('should return definitions/calling statements (with param names)', function () {
        var runtimeSpyJSON = {
            testedFunctionCall: 'testFunction(a,b,2)',
            resultLiteral: undefined,
            variables:
                [{
                    name: 'a',
                    values: 'new Map([[\'Initial\',\'a = [1,2,3]\']])'
                },
                {
                    name: 'b',
                    values: 'new Map([[\'Initial\',\'b = {q:1,w:[1,2,3]}\']])'
                    }],
            functions:[]
        }
        var resultCode = 'var myHarness = new Harness(\'myHarness\')\n' +
        'var mockRepositoryData = {}\n' +
        'myHarness.setMockRepositoryData(mockRepositoryData)\n' +
        'a_DB = new Map([[\'Initial\',\'a = [1,2,3]\']])\n' +
        'var a\n' +
        'myHarness.addGlobalVariableMock(\'a\',a_DB)\n' +
        'b_DB = new Map([[\'Initial\',\'b = {q:1,w:[1,2,3]}\']])\n' +
        'var b\n' +
        'myHarness.addGlobalVariableMock(\'b\',b_DB)\n' +
        'myHarness.updateVariablesByTag(\'Initial\',function(codeToEval){eval(codeToEval)})\n' +
        'testFunction(a,b,2)'
        expect(Harness.getHarnessCode('myHarness',runtimeSpyJSON)).equals(resultCode)
    })

    mocha.it('Mocks', function () {

        var runtimeSpyJSON = {
            testedFunctionCall: 'testFunction(A)',
            resultLiteral: 'result = 76',
            variables:
                [{ name: 'A', values: 'new Map([[\'Initial\',\'A = 5\']])' },
                {
                    name: 'globalVar',
                    values: 'new Map([[\'Initial\',\'globalVar = 5\'],[\'helper1_0\',\'globalVar = 42\'],[\'helper1_1\',\'globalVar = 10\']])'
                },
                {
                    name: 'globalVar2',
                    values: 'new Map([[\'Initial\',\'globalVar2 = {1:6,2:2,3:{1:1},4:{1:4,12:function(){}}};globalVar2[\\\'3\\\'][\\\'2\\\']=globalVar2\']])'
                }],
            functions:
                [
                    {
                        name: 'globalVar2[\'4\'][\'12\']',
                        values: '{input:[[3],[4]],output:[15,20]}'
                    }, { name: 'helper1', values: '{input:[[21],[5]],output:[42,10]}' },
                    { name: 'helper2', values: '{input:[[5]],output:[15]}' }]
        }
        var resultCode = 'var myHarness = new Harness(\'myHarness\')\n' +
        'var mockRepositoryData = {}\n' +
        'mockRepositoryData[\'globalVar2[\\\'4\\\'][\\\'12\\\']\'] = {input:[[3],[4]],output:[15,20]}\n' +
        'mockRepositoryData[\'helper1\'] = {input:[[21],[5]],output:[42,10]}\n' +
        'mockRepositoryData[\'helper2\'] = {input:[[5]],output:[15]}\n' +
        'myHarness.setMockRepositoryData(mockRepositoryData)\n' +
        'A_DB = new Map([[\'Initial\',\'A = 5\']])\n' +
        'var A\n' +
        'myHarness.addGlobalVariableMock(\'A\',A_DB)\n' +
        'globalVar_DB = new Map([[\'Initial\',\'globalVar = 5\'],[\'helper1_0\',\'globalVar = 42\'],[\'helper1_1\',\'globalVar = 10\']])\n' +
        'var globalVar\n' +
        'myHarness.addGlobalVariableMock(\'globalVar\',globalVar_DB)\n' +
        'globalVar2_DB = new Map([[\'Initial\',\'globalVar2 = {1:6,2:2,3:{1:1},4:{1:4,12:function(){}}};globalVar2[\\\'3\\\'][\\\'2\\\']=globalVar2\']])\n' +
        'var globalVar2\n' +
        'myHarness.addGlobalVariableMock(\'globalVar2\',globalVar2_DB)\n' +
        'myHarness.updateVariablesByTag(\'Initial\',function(codeToEval){eval(codeToEval)})\n' +
        'myHarness.addFunctionMock(\'globalVar2[\\\'4\\\'][\\\'12\\\']\')\n' +
        'globalVar2[\'4\'][\'12\']= function(){\n' +
        'var returnValue =  myHarness.callFunctionSpy(\'globalVar2[\\\'4\\\'][\\\'12\\\']\',arguments,function(codeToEval){eval(codeToEval)})\n' +
        'if (returnValue!=\'NOVALUERETURNED\')return eval(returnValue)\n' +
        '}\n' +
        'myHarness.addFunctionMock(\'helper1\')\n' +
        'helper1= function(){\n' +
        'var returnValue =  myHarness.callFunctionSpy(\'helper1\',arguments,function(codeToEval){eval(codeToEval)})\n' +
        'if (returnValue!=\'NOVALUERETURNED\')return eval(returnValue)\n' +
        '}\n' +
        'myHarness.addFunctionMock(\'helper2\')\n' +
        'helper2= function(){\n' +
        'var returnValue =  myHarness.callFunctionSpy(\'helper2\',arguments,function(codeToEval){eval(codeToEval)})\n' +
        'if (returnValue!=\'NOVALUERETURNED\')return eval(returnValue)\n' +
        '}\n' +
        'expect(myHarness.getLiteralAndCyclic(testFunction(A),\'result\')).equals(\'result = 76\')\n'

        expect(Harness.getHarnessCode('myHarness',runtimeSpyJSON)).equals(resultCode)
    })

})

