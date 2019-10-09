"use strict";

var moment = require('moment');

class MemorySchedulerPlus {
  constructor(
    // Relative time intervals between sessions / reviews / testing.
    // Check this URL of the "moment" package for possible object definitions:
    // https://momentjs.com/docs/#/manipulating/add/
    arrIntervals = [{days:1}, {days:2}, {days:3}, {days:8}, {days:17}],
    // [-3, -1, 1] maps to NO, UNSURE, YES
    // Decrements and increments index of arrIntervals
    arrConfidence = [-3, -1, 1]
  ) {
    this.arrIntervals = arrIntervals;
    this.arrConfidence = arrConfidence;
  }

  _newRecord(uniqueId, intervalDate, intervalIndex, intervalIsMaxedOut, correctInRow) {
    return {
      id: uniqueId, // for external read (your associated item-id)
      intervalDate: intervalDate.toDate(), // // for external read and internal use
      intervalIndex: intervalIndex, // for internal usage
      intervalMaxedOut: intervalIsMaxedOut, // for external read, nice to have
      correctInRow: correctInRow // for external read, nice to have
    }
  }

  /**
   * integer: intConfidence: how sure one is within the arrConfidence.
   * 0=unsure, 1=not-really, 2=sure (=max-length)
   *
   * Object: currentRecord
   */
  getNextRecord(intConfidence, currentRecord) {

    if (intConfidence < 0 || intConfidence > this.arrConfidence.length - 1) {
      throw 'Confidence not within range:' +
        ' 0 <= ' + intConfidence + ' <= ' + this.arrConfidence.length - 1;
    }

    const dateToday = moment();
    const intervalIndex = currentRecord.intervalIndex;
    let correctInRow = currentRecord.correctInRow;
    let intervalIsMaxedOut = false;
    let dateNext = dateToday.add(this.arrIntervals[0]);

    // User is max confident:
    // 1. The next (and larger) interval is chosen.
    // 2. If interval is maxed out the last (and largest) interval is chosen.
    if (intConfidence === this.arrConfidence.length - 1) {
      correctInRow++;
      dateNext = dateToday.add(this.arrIntervals[intervalIndex]);
    } else {
      correctInRow = 0;
    }

    let intervalIndexNext = intervalIndex + this.arrConfidence[intConfidence];

    // Cap intervalIndexNext to the max-length of arrIntervals
    intervalIndexNext = Math.min(intervalIndexNext, this.arrIntervals.length - 1)
    if (intervalIndexNext === this.arrIntervals.length - 1) {
      intervalIsMaxedOut = true;
    }

    return this._newRecord(
      currentRecord.id,
      dateNext,
      Math.max(0, intervalIndexNext),
      intervalIsMaxedOut,
      correctInRow);
  }

  getInitialRecord(id) {
    return this._newRecord(id, moment().subtract(1), 0, false, 0);
  }
}

module.exports = MemorySchedulerPlus;
