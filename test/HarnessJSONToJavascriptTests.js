var mocha = require('mocha')
var chai = require('chai')
var expect = chai.expect
var HarnessJSONToJavascript = require('../src/HarnessJSONToJavascript')

mocha.describe('Get Javscript from harness(Code) JSON', function () {

    mocha.it('Variable and Function', function () {

        var harnessJSON = [
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
                                { validateInputAndGetOutput: { function: 'a', DB: 'a_DB', counter: 'a_counter', outputVariable: 'output' } },
                                { increaseCounterByOne: { counter: 'a_counter' } },
                                { returnOutput: { returnedVariable: 'output' } }]
                        }
                    }
                ]
            }
        ]
        var expectedJavascript = 'var a_DB = [{"arguments":[1,5],"returnValue":6},{"arguments":[5,-3],"returnValue":2}]\n' +
            'var a_counter = 0\n' +
            'var a = function(){\n' +
            'expect(Array.from(arguments)).deep.equal(a_DB[a_counter].arguments)\n' +
            'var output = a_DB[a_counter].returnValue\n' +
            'a_counter++\n' +
            'return output\n' +
            '}\n'
        expect(HarnessJSONToJavascript(harnessJSON)).equals(expectedJavascript)
    })
})