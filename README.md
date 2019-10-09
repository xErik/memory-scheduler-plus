# memory-scheduler-plus

Memory Scheduler Plus is a scheduling service used to memorize items.

You provide with a custom-ID of the item you want the user to remember.

The user provide a confidence rating regarding his memorization of said item.

Based in the user's confidence the next review of said item is scheduled.

If the user is confident (or successful) the review iteration will increase until it is maxed out. In this case subsequent reviews will be scheduled with the specified max interval.

If the user is not confident (or not successful) the review iteration will decrease.

## Installation

```shell
npm i memory-scheduler-plus --save
```

## Data structure

The function

```javascript
record = ms.getNextRecord(intConfidence, record);
```

expects and returns JSON-Objects of the same structure. Both objects do not share a reference but are independent.

`id`: Your custom id referring to your custom item

`intervalDate`: At this UTC-date the user is to be tested with your custom item. The user then answers with a confidence level (typically: 0,1,2).

`intervalIndex`: Internal usage.

`intervalMaxedOut`: Has the user learned your custom item successfully?

`correctInRow`: How many successful answers have been given in a row by the user (just nice to have).

```javascript
{ id: 'myUniqueItemId',
  intervalDate: 2019-10-10T10:00:07.343Z,
  intervalIndex: 1,
  intervalMaxedOut: false,
  correctInRow: 1 }
```

## Usage

The progress internally is mapped by a confidence-array which dictates which value from an interval-array is selected.

Success (or confidence) leads to increasing testing gaps. The next test will happen in the far future.

Failure (or non-confidence) leads to decreasing testing gaps. The next test will happen in the near future.

Once the last interval-array item has been reached, the record is marked as learned via the boolean attribute `intervalMaxedOut = true`.

```
// Relative days between session
arrIntervals = [1, 2, 3, 8, 17],
// [-3, -1, 1] maps to NO, UNSURE, YES
//
// Decrements and increments index of arrIntervals
arrConfidence = [-3, -1, 1]
```

```javascript
let MemorySchedulerPlus = require('memory-scheduler-plus')

/**
 * 1. Create an initial record with your custom ID.
 *
 * The custom ID should refer to the item you want to test.
 */


const ms = new MemorySchedulerPlus()

let record = ms.getInitialRecord('myUniqueItemId')

// console.log(record)
//
// { id: 'myUniqueItemId',
//   intervalDate: 2019-10-08T10:00:07.329Z,
//   intervalIndex: 0,
//   intervalMaxedOut: false,
//   correctInRow: 0 }

/**
 * 2. The user sets a confidence level.
 *
 * intConfidence: Valid values are: 0,1,2
 * 0 = fail, 1 = unsure, 2 = sure
 *
 * This time, the user is CONFIDENT (= 2).
 */

let intConfidence = 2;

record = ms.getNextRecord(intConfidence, record);

// console.log(record)
//
// { id: 'myUniqueItemId',
//   intervalDate: 2019-10-10T10:00:07.343Z,
//   intervalIndex: 1,
//   intervalMaxedOut: false,
//   correctInRow: 1 }

/**
 * 3. The user sets a confidence level.
 *
 * This time, the user is UNSURE ( = 1)
 */

intConfidence = 1;

record = ms.getNextRecord(intConfidence, record);

// console.log(record)
//
// { id: 'myUniqueItemId',
//   intervalDate: 2019-10-10T10:03:43.045Z,
//   intervalIndex: 0,
//   intervalMaxedOut: false,
//   correctInRow: 0 }

/**
 * 4. The user sets a confidence level.
 *
 * This time, the user FAILS ( = 0)
 */

intConfidence = 0;

record = ms.getNextRecord(intConfidence, record);

```

### Advanced Usage

The default constructor is given below, its values will be used if not set by you.

Internally, the [moment](https://momentjs.com/docs/#/manipulating/add/) package is used.

```javascript
class MemorySchedulerPlus {
  constructor(

    // Relative time intervals between sessions / reviews / testing.
    // Check this URL of the "moment" package for possible object definitions:
    // https://momentjs.com/docs/#/manipulating/add/
    arrIntervals = [{days:1}, {days:2}, {days:3}, {days:8}, {days:17}],

    // [-3, -1, 1] maps to NO, UNSURE, YES
    // Decrements and increments index of arrIntervals

    arrConfidence = [-3, -1, 1]
  )
}
```

You may define iterations as well as confidence-levels (that select the next iteration) as you like:

* The constructor parameter `arrIntervals` follows the moment Object-definition to define the intervals.
* The constructor parameter `arrConfidence` defines which following interval from `arrIntervals` is applied - by stepping backward or forward.

**Example**

* Instead of using days as intervals you may use _hours_.
* The default confidence-configuration to select the next interval is still used:
  * confidence-level-index-0 = FAIL = move-back-3
  * confidence-level-index-1 = UNSURE = move-back-1
  * confidence-level-index-2 = CONFIDENT = move-ahead-1

```javascript
let MemorySchedulerPlus = require('memory-scheduler-plus')

const ms = new MemorySchedulerPlus(
  [{hours:1}, {hours:2}, {hours:3}, {hours:8}, {hours:17}],
  [-3, -1, 1]
)
```

## Credits

This work is based based on [Memory Scheduler](https://www.npmjs.com/package/memory-scheduler).

## License

MIT

Licensed under MIT
