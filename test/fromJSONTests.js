var mocha = require('mocha')
var chai = require('chai')
var expect = chai.expect
var spyJSONToHarnessJSON = require('../src/SpyJSONToHarnessJSON')

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
            { variableDefinition: { name: 'a',value : 2 } }
        ]
        expect(spyJSONToHarnessJSON(spyJSON)).to.deep.equal(expectedJSON)
    })
})