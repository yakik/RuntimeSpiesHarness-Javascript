var Harness = require('../src/Harness')
var VariableLiteral = require('variable-literal')
var mocha = require('mocha')
var chai = require('chai')
var expect = chai.expect

mocha.describe('Harness Tests', function () {

    mocha.it('long Function name', function () {
        var b = { w: {}}
        var testFunction = function () {
            var a = b.w.b()
            return a
        }
        var myHarness = new Harness('myHarness')
        var mockRepositoryData = {}
        mockRepositoryData['b.w.b'] = { input: [[]], output: [3] }
        myHarness.setMockRepositoryData(mockRepositoryData)
        myHarness.updateVariablesByTag('Initial', function (codeToEval) { eval(codeToEval) })
        myHarness.addFunctionMock('b.w.b')
        
        b.w.b = function () {
            var returnValue = myHarness.callFunctionSpy('b.w.b', arguments, function (codeToEval) { eval(codeToEval) })
            if (returnValue != 'NOVALUERETURNED') return eval(returnValue)
        }
        testFunction()
    })

    mocha.it('should return definitions/calling statements (no param names)', function () {
        var a = []
        var b = {}
        var testFunction = function () {
            return a[0] + b.q
        }
        var myHarness = new Harness('myHarness')
        var mockRepositoryData = {}
        myHarness.setMockRepositoryData(mockRepositoryData)
        myHarness.updateVariablesByTag('Initial', function (codeToEval) { eval(codeToEval) })
        testFunction()
    })

    mocha.it('should return definitions/calling statements (with param names)', function () {
        var testFunction = function (A, B, C) {
            return a[0] + b.q
        }
        var myHarness = new Harness('myHarness')
        var mockRepositoryData = {}
        myHarness.setMockRepositoryData(mockRepositoryData)
        a_DB = new Map([['Initial', 'a = [1,2,3]']])
        var a

        myHarness.addGlobalVariableMock('a', a_DB)
        b_DB = new Map([['Initial', 'b = {q:1,w:[1,2,3]}']])
        var b

        myHarness.addGlobalVariableMock('b', b_DB)
        myHarness.updateVariablesByTag('Initial', function (codeToEval) { eval(codeToEval) })
        testFunction(a, b, 2)
    })

    mocha.it('Mocks', function () {
        var testFunction = function (A) {
            helper1(21)
            var a = globalVar2['4']['12'](3)
            var result = a + helper1(A) + helper2(A) + globalVar + globalVar2['3']['2']['1'] + globalVar2['4']['12'](4)
            return result
        }

        var myHarness = new Harness('myHarness')
        var mockRepositoryData = {}
        mockRepositoryData['globalVar2[\'4\'][\'12\']'] = { input: [[3], [4]], output: [15, 20] }
        mockRepositoryData['helper1'] = { input: [[21], [5]], output: [42, 10] }
        mockRepositoryData['helper2'] = { input: [[5]], output: [15] }
        myHarness.setMockRepositoryData(mockRepositoryData)
        A_DB = new Map([['Initial', 'A = 5']])
        var A

        myHarness.addGlobalVariableMock('A', A_DB)
        globalVar_DB = new Map([['Initial', 'globalVar = 5'], ['helper1_0', 'globalVar = 42'], ['helper1_1', 'globalVar = 10']])
        var globalVar

        myHarness.addGlobalVariableMock('globalVar', globalVar_DB)
        globalVar2_DB = new Map([['Initial', 'globalVar2 = {1:6,2:2,3:{1:1},4:{1:4,12:function(){}}};globalVar2[\'3\'][\'2\']=globalVar2']])
        var globalVar2

        myHarness.addGlobalVariableMock('globalVar2', globalVar2_DB)
        myHarness.updateVariablesByTag('Initial', function (codeToEval) { eval(codeToEval) })
        myHarness.addFunctionMock('globalVar2[\'4\'][\'12\']')
        globalVar2['4']['12'] = function () {
            var returnValue = myHarness.callFunctionSpy('globalVar2[\'4\'][\'12\']', arguments, function (codeToEval) { eval(codeToEval) })
            if (returnValue != 'NOVALUERETURNED') return eval(returnValue)
        }
        myHarness.addFunctionMock('helper1')
        helper1 = function () {
            var returnValue = myHarness.callFunctionSpy('helper1', arguments, function (codeToEval) { eval(codeToEval) })
            if (returnValue != 'NOVALUERETURNED') return eval(returnValue)
        }
        myHarness.addFunctionMock('helper2')
        helper2 = function () {
            var returnValue = myHarness.callFunctionSpy('helper2', arguments, function (codeToEval) { eval(codeToEval) })
            if (returnValue != 'NOVALUERETURNED') return eval(returnValue)
        }
        expect(myHarness.getLiteralAndCyclic(testFunction(A),'result')).equals('result = 76')
    })
})
