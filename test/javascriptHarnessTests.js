var mocha = require('mocha')
var chai = require('chai')
var expect = chai.expect
var SpyJSONToHarnessJSON = require('../src/SpyJSONToHarnessJSON')

mocha.describe('test generated javascript code', function () {

    mocha.it('test mock functions', function () {
        var testFunction = function (a) {
            return a(1, 5) + a(5,-3)
        }

        var a_DB = [{"arguments":[1,5],"returnValue":6},{"arguments":[5,-3],"returnValue":2}]
        var a_counter = 0
        var a = function () {
        expect(Array.from(arguments)).deep.equal(a_DB[a_counter].arguments)
        var output = a_DB[a_counter].returnValue
        a_counter++
        return output
        }

        expect (testFunction(a)).equals(8)
        

    })
})
   