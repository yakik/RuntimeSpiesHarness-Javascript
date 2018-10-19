var VariableLiteral = require('variable-literal')


class GlobalVariableMock {
    constructor(variableName, harnessName, dataMap) {
        this.variableName = variableName
        this.harnessName = harnessName
        this.dataMap = dataMap
    }

    getDefinitionByTag(tag) {
        return this.dataMap.get(tag)
    }
}
module.exports = GlobalVariableMock