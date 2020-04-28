[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/dmcquay/how-should-i-test-this)

This repository is for a workshop on testing. It is intended to be completed via Gitpod. Click the Gitpod button above to get started.

![Testing Pyramid: Unit, Integration, Acceptance](docs/testing-pyramid.jpg)

## Problem Definition

Add the following API endpoint:

**GET /order-stats**

Example payload:

```json
{
  "sunday": 1056,
  "monday": 1511,
  "tuesday": 1223,
  "wednesday": 1342,
  "thursday": 1497,
  "friday": 2711,
  "saturday": 1645
}
```

## Step 1: Add test for new endpoint

### Create first blank acceptance test

Create an empty test. We'll be using the mocha framework. It is already installed.

`start/api/src/order-stats.a-test.ts`

```ts
it("works", () => {});
```

Now we need a way to run our acceptance tests. Add the following to the scripts section of `api/package.json`.

`"test:acceptance": "mocha --require ts-node/register src/**/*.a-test.ts",`

And now let's run the tests: `npm run test:acceptance`
They should be passing.

### Exepct the endpoint to return JSON encoded data that looks to be about the right shape

Replace your dummy test with the following

`src/order-stats.a-test.ts`

```ts
import { expect } from "chai";
import fetch from "node-fetch";
import config from "./config";

describe("GET /order-stats", () => {
  it("should return a JSON object with days for keys and numbers for values", async () => {
    const response = await fetch(`${config.test.baseUrl}/order-stats`);
    expect(response.status).to.equal(200);
    const stats = await response.json();
    expect(typeof stats.monday).to.equal("number");
  });
});
```

Add to `config.ts`:

```ts
test: {
  baseUrl: e.BASE_URL || "http://localhost:3000",
},
```

Run acceptance tests again: `npm run test:acceptance`
It should fail because you're getting a 404 but you expect a 200.

**Opinion: why I suggest verifying little at this layer:**

- Because I’d like to be able to run acceptance tests in a fully integrated environment where it will be much harder to control data
- Because I can verify exact values and shape with unit tests

## Step 2: Make your test pass in the most simple way possible

Edit `server.ts` and add this endpoint.

```ts
app.get("/order-stats", async (req: Request, res: Response) => {
  const stats = {
    monday: 1,
  };
  res.send(stats);
});
```

Run acceptance tests again: `npm run test:acceptance`
They should now be passing.

**Opinion: Why implement this fake implementation?**

- Prove that your tests work
- One failing test at a time

## Step 3: Get the data out of the database

I've already provided `order-repository.ts` so you can follow an established pattern for fetching data from the database. We'll make a new function in
this file to get the stats we need from the database. But first let's start
with a test!

### What type of test do we need?

Let's walk the pyramid from lightest to heaviest.

- Unit tests (insufficient)
- **Integration tests** (perfect)
- Acceptance tests (too heavy)

### Set up integration test suite

Create `order-repository.i-test.ts` with our standard dummy test.

```ts
it("works", () => {});
```

Add to `start/api/package.json`:

```json
"test:integration": "mocha --require ts-node/register src/**/*.i-test.ts"
```

Run `npm run test:integration`.
Expected result: passing

**Opinion: Why have separate entrypoints for different types of tests?**

- I tend to run tests at the bottom of the pyramid more frequently. For example,
  I often run my unit tests in watch mode all the time that I am coding, but I
  may run acceptance tests only when I finish a chunk of new code.
- You will likely want to run different test types during different phases of your
  build pipeline. You'll likely run unit tests as early as possible, but it is
  common to build and deploy your app somewhere and then run your acceptance tests
  against the environment you just deployed to, which happens much later in your
  build pipeline.

### Make real test

Add the following to `models.ts`.

```ts
export interface AverageOrderSizeByDayOfWeekStatsRecord {
  averageOrderAmount: number;
  dayOfWeek: number;
}
```

This is what the raw data coming from the database will look like.

Replace our dummy integration test with a real one.

`order-repository.i-test.ts`

```ts
import { expect } from "chai";

import { getAvgOrderAmountByDay } from "./order-repository";
import { AverageOrderSizeByDayOfWeekStatsRecord } from "./models";

describe("order-repository", () => {
  describe("#getAvgOrderAmountByDay", () => {
    it("should return the avg amount per weekly day", async () => {
      const expectedRecords: AverageOrderSizeByDayOfWeekStatsRecord[] = [
        { dayOfWeek: 0, averageOrderAmount: 1625 },
        { dayOfWeek: 4, averageOrderAmount: 5489 },
        { dayOfWeek: 5, averageOrderAmount: 941 },
      ];

      const actualRecords = await getAvgOrderAmountByDay();

      expect(actualRecords).to.eql(expectedRecords);
    });
  });
});
```

Add to `order-repository.ts`.

```ts
export async function getAvgOrderAmountByDay(): Promise<
  AverageOrderSizeByDayOfWeekStatsRecord[]
> {
  const results = await pool.query(`
    SELECT
      CAST(ROUND(AVG(amount_cents)) AS INT) AS "averageOrderAmount",
      DATE_PART('dow', created_at) AS "dayOfWeek"
    FROM "order"
    GROUP BY DATE_PART('dow', created_at)
    ORDER BY "dayOfWeek" ASC
  `);
  return results.rows;
}
```

You'll need to import `AverageOrderSizeByDayOfWeekStatsRecord` from `models.ts`.

Run: `npm run test:integration`
Expected result: passing

Two things feel weird.

1. The tests "hang" for a while at the end before the process exits.
2. Where did that data come from? Can I trust that it?

### Fix the "hanging" issue

We need to close the connection to postgres at the end of the test suite.

Create `integration-test-setup.ts` with this content.

```ts
import { pool } from "./database-service";

after(() => {
  pool.end();
});
```

Configure mocha to load this file prior first.

Edit the integration test script in `package.json` to the following:

`"test:integration": "mocha --require ts-node/register --file src/integration-test-setup.ts src/**/*.i-test.ts"`

Run: `npm run test:integration`
Expected result: passes & exits immediately

### Control our test data

When we ran our query to get average order amounts, we got some non-zero numbers, indicating
that there are already orders in the database. How did they get there?

The data came from `initdb/02-seed-data.sql`. This file provides enough seed
data for the app to run locally and look normal.

Should we rely on this data in our test suite? Probably not and here's why.

- If you want to add data for other use cases in the future, you're going to have have to
  edit any affected tests. This is an undesirable coupling that will cause you extra work.
- Data could be inserted into this database from other sources such as a human POSTing to
  the `/orders` endpoint to do some manual testing or perhaps another integration test that
  inserts some data.

We should set up our tests to be able to fully control the data instead of relying on data
expected to already be there.

To accomplish this, let's actually use a completely separate database that has no seed data
in it! Then, for each test, we will insert data at the beginning of the test and delete it
at the end of the test.

I have already set up a test database for you. Let's explore it for a moment.
Go to your terminal tab labeled "DB".

```sql
select * from "order";
```

Here you can see our seed data.
Now let's switch to our testing database.

```sql
\c order_management_test;
select * from "order";
```

Let's configure
our app to use the test database when running integration tests. If you look at `config.ts`,
you'll see that we can override the postgres database by setting the `POSTGRES_DATABASE` environment
variable.

Edit `api/package.json` once again to override the database.

`"test:integration": "POSTGRES_DATABASE=order_management_test mocha --require ts-node/register --file src/integration-test-setup.ts src/**/*.i-test.ts"`

Run: `npm run test:integration`
Expected result: fail (no data)

Insert the data we need and clean it up when we are done by adding these blocks.

In `order-repository.i-test.ts`, put these inside the `describe("#getAvgOrderAmountByDay"` block.

```ts
before(async () => {
  await pool.query(`
    INSERT INTO "order"
    (id, amount_cents, created_at, risk_score)
    VALUES
    ('id-1', 1256, '2020-04-10', 22),
    ('id-2', 5489, '2020-04-02', 12),
    ('id-3', 625, '2020-04-03', 55),
    ('id-3', 1625, '2020-04-05', 66)
  `);
});

after(async () => {
  await pool.query('DELETE FROM "order"');
});
```

And import `pool`.

```typescript
import { pool } from "./database-service";
```

Run: `npm run test:integration`
Expected result: passing

## Step 4: Transform the result

The data is coming out of the database as a list of
`AverageOrderSizeByDayOfWeekStatsRecord`s. But remember from the requirements that
we need it to look like this:

```json
{
  "sunday": 1056,
  "monday": 1511,
  "tuesday": 1223,
  "wednesday": 1342,
  "thursday": 1497,
  "friday": 2711,
  "saturday": 1645
}
```

Let's create a model for that. Let's define that interface in `models.ts`.

```ts
export interface AverageOrderSizeByDayOfWeekStatsModel {
  sunday: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
}
```

And now we need to transform a list of `AverageOrderSizeByDayOfWeekStatsRecord`s to a single
`AverageOrderSizeByDayOfWeekStatsModel`. You might be tempted to do this in
`order-repository.ts`, but don't!

- This is a separate concern (or responsibility) from interacting with the database. SRP
  (single responsibility principle) states that we shouldn't mix these two concerns in a
  single function.
- The test pyramid tells us to favor the bottom of the pyramid. This can easily be tested
  with a unit test. If we add this code to our repository layer, it must be tested with integration tests.

So let's implement this in the aptly named `transforms.ts` file.

But, of course, let's start with a test first.

`transforms.test.ts`

```ts
import { expect } from "chai";

import { AverageOrderSizeByDayOfWeekStatsRecord } from "./models";

import { averageOrderSizeByDayOfWeekRecordsToModel } from "./transforms";

describe("transforms", () => {
  describe("#averageOrderSizeByDayOfWeekRecordsToModel", () => {
    context("when out of order and missing some data", () => {
      it("should map all values correctly and default to 0", () => {});
      const records: AverageOrderSizeByDayOfWeekStatsRecord[] = [
        { dayOfWeek: 0, averageOrderAmount: 10 },
        { dayOfWeek: 1, averageOrderAmount: 11 },
        { dayOfWeek: 3, averageOrderAmount: 13 },
        { dayOfWeek: 2, averageOrderAmount: 12 },
        { dayOfWeek: 4, averageOrderAmount: 14 },
        { dayOfWeek: 6, averageOrderAmount: 16 },
      ];

      const expectedModel = {
        sunday: 10,
        monday: 11,
        tuesday: 12,
        wednesday: 13,
        thursday: 14,
        friday: 0,
        saturday: 16,
      };

      const actualModel = averageOrderSizeByDayOfWeekRecordsToModel(records);

      expect(actualModel).to.eql(expectedModel);
    });
  });
});
```

This is our first unit test. We need to set up a script in `package.json` to run unit
tests.

`"test:unit": "mocha --require ts-node/register src/**/*.test.ts"`

Run: `npm run test:unit`
Expected result: fail (function doesn't exist)

Add to `transforms.ts`:

```ts
function getAverageOrderAmountForDayOfWeekFromRows(
  dayOfWeek: number,
  rows: any[]
) {
  const row = rows.find((x) => x.dayOfWeek === dayOfWeek);
  return row ? (row.averageOrderAmount as number) : 0;
}

export function averageOrderSizeByDayOfWeekRecordsToModel(
  records: AverageOrderSizeByDayOfWeekStatsRecord[]
): AverageOrderSizeByDayOfWeekStatsModel {
  return {
    sunday: getAverageOrderAmountForDayOfWeekFromRows(0, records),
    monday: getAverageOrderAmountForDayOfWeekFromRows(1, records),
    tuesday: getAverageOrderAmountForDayOfWeekFromRows(2, records),
    wednesday: getAverageOrderAmountForDayOfWeekFromRows(3, records),
    thursday: getAverageOrderAmountForDayOfWeekFromRows(4, records),
    friday: getAverageOrderAmountForDayOfWeekFromRows(5, records),
    saturday: getAverageOrderAmountForDayOfWeekFromRows(6, records),
  };
}
```

You'll have to import `AverageOrderSizeByDayOfWeekStatsRecord` and
`AverageOrderSizeByDayOfWeekStatsModel` from `models.ts`.

Run: `npm run test:unit`
Expected result: passing

## Step 5: Put it all together

We could go back to `server.ts` and use our new functions directly there. I recommend
keeping your top-level application logic separate from protocols like HTTP though.
To that end, let's create the following:

`order-service.ts`

```ts
import * as orderRepo from "./order-repository";
import { averageOrderSizeByDayOfWeekRecordsToModel } from "./transforms";

export async function getAvgOrderAmountByDay() {
  const records = await orderRepo.getAvgOrderAmountByDay();
  const model = averageOrderSizeByDayOfWeekRecordsToModel(records);
  return model;
}
```

We left our acceptance tests passing. Let's double check that they still are.

Run: `npm run test:acceptance`
Expected result: passing

Refactor the `/order-stats` route in `server.ts` to use the functions we just created.

```ts
app.get("/order-stats", async (req: Request, res: Response) => {
  const stats = await getAvgOrderAmountByDay();
  res.send(stats);
});
```

Import `getAvgOrderAmountByDay`:

```ts
import { getAvgOrderAmountByDay } from "./order-service";
```

Run: `npm run test:acceptance`
Expected result: passing

## Step 6: Review and debate!

- We didn't write any tests for `order-service.ts`. Should we have?
- We didn't handle any error cases. What important error cases do you think we missed?
- Take a look at a more simple repository function like `getOrderById`. Does it warrant
  an integration test? And how do you feel about that `SELECT *`? Should we be
  specifying columns?
- Take a look back at our overall testing values/goals and the testing pyramid. How
  well do you think we achieved those goals? Would you have approached this differently?

## Appendix

### Types of tests

There are many types of tests. And their defintions are not always consistent.
Here is a reference I think is brief and accurate:
[Types of tests](https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing)

### Attributes of an effective testing strategy

- Provide confidence of correctness
- Encourage pleasant coding experience
- Provide documentation
- Easy to write
- Easy to read/maintain
- Fast to execute
- Support refactoring (refactor production code without editing tests)
- Consistently passes or fails given unchanging code

What would you add to or remove from this list?