let chai = require ('chai')
var assert = chai.assert

// assert.typeOf(foo, 'string')
// assert.equal(foo, 'bar')
// assert.lengthOf(foo, 3)
// assert.property(tea, 'flavors')
// assert.lengthOf(tea.flavors, 3)

let MemorySchedulerPlus = require('./index')

const ms = new MemorySchedulerPlus()

let record = ms.getInitialRecord('myUniqueItemId')

assert.equal(0, record.intervalIndex)
assert.equal(false, record.intervalMaxedOut)
assert.equal(0, record.correctInRow)
assert.typeOf(record.intervalDate, 'Date')

let intConfidence = 2

record = ms.getNextRecord(intConfidence, record)
record = ms.getNextRecord(intConfidence, record)
record = ms.getNextRecord(intConfidence, record)
record = ms.getNextRecord(intConfidence, record)

assert.equal(4, record.intervalIndex)
assert.equal(true, record.intervalMaxedOut)
assert.equal(4, record.correctInRow)
assert.typeOf(record.intervalDate, 'Date')

record = ms.getNextRecord(intConfidence, record)

assert.equal(4, record.intervalIndex)
assert.equal(true, record.intervalMaxedOut)
assert.equal(5, record.correctInRow)
assert.typeOf(record.intervalDate, 'Date')

intConfidence = 1
record = ms.getNextRecord(intConfidence, record)

assert.equal(3, record.intervalIndex)
assert.equal(false, record.intervalMaxedOut)
assert.equal(0, record.correctInRow)
assert.typeOf(record.intervalDate, 'Date')

intConfidence = 0
record = ms.getNextRecord(intConfidence, record)

assert.equal(0, record.intervalIndex)
assert.equal(false, record.intervalMaxedOut)
assert.equal(0, record.correctInRow)
assert.typeOf(record.intervalDate, 'Date')
