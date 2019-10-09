# memory-scheduler-plus

Memory Scheduler Plus is a scheduling service used to memorize items.

You provide a custom-ID of the item you want the user to remember.

The user provides a confidence rating regarding the memorization of said item.

Based in the user's confidence the next review of said item is scheduled as an UTC-Date-Object.

If the user is confident (or successful) the review iteration will increase until it is maxed out. In this case, subsequent reviews will be scheduled with the specified max interval.

If the user is not confident (or not successful) the review iteration will decrease.

You may configure the review interval however you like: months, hours, minutes, etc.

You may configure the confidence-levels the user may select which in turn impact the following review interval.

## Installation

```shell
npm i memory-scheduler-plus --save
```

## Data structure

The function `getNextRecord` expects and returns JSON-Objects of the same structure. Both objects do not share a reference but are independent.

```javascript
record = ms.getNextRecord(intConfidence, record);
```

```javascript
{ id: 'myUniqueItemId',
  intervalDate: 2019-10-10T10:00:07.343Z,
  intervalIndex: 1,
  intervalMaxedOut: false,
  correctInRow: 1 }
```

- `id<string>`: Your custom id referring to your custom item. It is just a marker used by you.
- `intervalDate<Date>`:  At this UTC-date the user is to be tested with your custom item. This date is to be used by you. _ `intervalIndex<int>` Internal usage.
- `intervalMaxedOut<bool>`:  Has the user learned your custom item successfully? To be used by you. (In this case, the `intervalIndex` is set to the max interval, just to refresh the users's memory now and then.)
- `correctInRow<int>`: How many successful answers have been given in a row by the user. To be used by you for ... fancy motivation stuff?

## Usage

Success (or confidence) leads to increasing testing gaps. The next test will happen in the far future.

Failure (or non-confidence) leads to decreasing testing gaps. The next test will happen in the near future.

**How To Use**

```javascript
let MemorySchedulerPlus = require("memory-scheduler-plus");

/**
 * 1. Create an initial record with your custom ID.
 *
 * The custom ID should refer to the item you want to test.
 */

const ms = new MemorySchedulerPlus();

let record = ms.getInitialRecord("myUniqueItemId");

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

/**
 * 3. The user sets a confidence level.
 *
 * This time, the user is UNSURE ( = 1)
 */

intConfidence = 1;

record = ms.getNextRecord(intConfidence, record);

/**
 * 4. The user sets a confidence level.
 *
 * This time, the user FAILS ( = 0)
 */

intConfidence = 0;

record = ms.getNextRecord(intConfidence, record);
```

### Advanced Usage

The default constructor is given below, it's values will be used if not set by you.

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

- The constructor parameter `arrIntervals` follows the `moment` Object-definition to define the intervals. The values of `arrIntervals` must increase!
- The constructor parameter `arrConfidence` defines which following interval from `arrIntervals` is applied - by stepping backward or forward. The values of `arrConfidence` must increase!

**Example Using Hours**

- Instead of using days as intervals you may use others like _minutes_, _hours_, _months_ and mix them.
- The default confidence-configuration to select the next interval is still used:
  - confidence-level-index-0 = FAIL = move-back-3
  - confidence-level-index-1 = UNSURE = move-back-1
  - confidence-level-index-2 = CONFIDENT = move-ahead-1

```javascript
let MemorySchedulerPlus = require("memory-scheduler-plus");

const ms = new MemorySchedulerPlus(
  [
    { hours: 4 },
    { hours: 8 },
    { hours: 24 },
    { days: 3 },
    { days: 7 },
    { months: 1 },
    { months: 6 },
    { years: 1 }
  ],
  [-3, -1, 1]
);

let record = ms.getInitialRecord("myUniqueItemId");

let intConfidence = 2;

record = ms.getNextRecord(intConfidence, record);
```

## Credits

This work is based on [Memory Scheduler](https://www.npmjs.com/package/memory-scheduler).

## License

MIT

Licensed under MIT
