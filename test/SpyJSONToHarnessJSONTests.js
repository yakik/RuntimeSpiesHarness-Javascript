var mocha = require('mocha')
var chai = require('chai')
var expect = chai.expect
var SpyJSONToHarnessJSON = require('../src/SpyJSONToHarnessJSON')

mocha.describe('Get Code JSON From Spy JSON', function () {

    mocha.it('One Variable', function () {

        var spyJSON = {
            testedFunctionCall: 'testFunction(a)',
            resultLiteral: 'NOTSET',
            variables:
                [{
                    name: 'a',
                    values: [{
                        timing: 'Initial',
                        value: 2
                    }]
                }
                ],
            functions: []
        }
        var expectedJSON = [
            { variableDefinition: { name: 'a', value: 2 } }
        ]
        expect(SpyJSONToHarnessJSON(spyJSON)).to.deep.equal(expectedJSON)
    })
    mocha.it('One Function', function () {

        var spyJSON = {
            testedFunctionCall: 'testFunction(a)',
            resultLiteral: 'NOTSET',
            variables: [],
            functions: [{
                name: 'a',
                traffic: [{
                    callNumber: 0,
                    arguments: [1, 5],
                    returnValue: 6
                }, {
                    callNumber: 1,
                    arguments: [5, -3],
                    returnValue: 2
                }]
            }]
        }
        var expectedJSON = [
            {
                functionHarness: [
                    {
                        variableDefinition: {
                            name: 'a_DB',
                            value: [{
                                arguments: [1, 5],
                                returnValue: 6
                            }, {
                                arguments: [5, -3],
                                returnValue: 2
                            }]
                        }
                    }, { variableDefinition: { name: 'a_counter', value: 0 } },
                    {
                        functionDefinition: {
                            name: 'a',
                            content: [
                                { validateInputAndGetOutput: { function: 'a', DB: 'a_DB', counter: 'a_counter', toVariable: 'output' } },
                                { increaseCounterByOne: { counter: 'a_counter' } },
                                { returnOutput: { returnedVariable: 'output' } }]
                        }
                    }
                ]
            }
        ]
        expect(SpyJSONToHarnessJSON(spyJSON)).to.deep.equal(expectedJSON)
    })
})