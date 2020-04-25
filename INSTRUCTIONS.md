I have provded an example e-commerce order management API. It only has a few CRUD endpoints so far. Today we are going to be adding a new endpoint with a focus on how to test it. All tests have been removed from the start folder so that you can work through how to setup all the testing from scratch.

## Step 1: Get the project running

CD into the start directory
Follow the README

## Step 2: Add test for new endpoint

### Background

The new endpoint should be located at /order-stats.
It should return a JSON encoded body that has a key for each day of the week.
The values should be the average of order amounts, in cents, for all orders placed on that day of the week.

Example payload:

```json
{
  "sunday": 10,
  "monday": 11,
  "tuesday": 12,
  "wednesday": 13,
  "thursday": 14,
  "friday": 0,
  "saturday": 16
}
```

### Create first blank acceptance test

Create an empty test. Mocha is already provided for you.

`src/order-stats.a-test.ts`

```typescript
it("works", () => {});
```

Now we need a way to run our acceptance tests. Add the following to the scripts section of `api/package.json`.

`"test:acceptance": "mocha --require ts-node/register src/**/*.a-test.ts",`

And now let's run the tests: `npm run test:acceptance`
They should be passing.

### Exepct the endpoint to return JSON encoded data that looks to be about the right shape

Replace your dummy test with the following

`src/order-stats.a-test.ts`

```typescript
describe("GET /order-stats", () => {
  it("should return a JSON object with days for keys and numbers for values", async () => {
    const response = await fetch(`${config.test.baseUrl}/order-stats`);
    const stats = await response.json();
    expect(typeof stats.monday).to.equal("number");
  });
});
```

Now run your test and it should be failing.

### Make your test pass in the most simple way possible for now

Edit `server.ts` and add this endpoint.

```typescript
app.get("/order-stats", async (req: Request, res: Response) => {
  const stats = {
    monday: 1,
  };
  res.send(stats);
});
```

Now run your tests. They should be passing.

###
