# What is this?

This is an example web application. It has a couple endpoints that run SQL queries of varying complexity. The purpose is explore various methods of testing such endpoints.

# Getting Started

## Dependencies

- Docker
- Node (check .nvmrc for version, or just use nvm)

Running other stuff in Docker? Easy way to stop it: `docker ps -q | xargs docker stop`

- Setup Environment: `npm run setup-environment`
- Run API: `npm start`
- Run Tests: `npm test`

# Decisions

- Integration vs E2E
- Extracting logic/transforms from I/O
- Tests rely on seed data? Or insert/cleanup in suite?
- Do all queries need an integration test? Rely on E2E test when needs are basic. Write integration tests for more complex queries.
- Should you treat data in your database as trusted or untrusted?
  - Would you test the types coming back from an API?
  - Why would you trust your database schema less?
- What if we introduce types? Do we need any tests at all?
- Acceptance tests
  - Should your acceptance tests use something like supertest or hit the actual API via HTTP?
  - Should you write your tests so that they can be executed against an uncontrolled environment like staging?
- Should you use actual services from other teams in your dev env and tests? Or mock them so you can fully control?

# Types of Tests

https://www.atlassian.com/continuous-delivery/software-testing/types-of-software-testing
https://stackoverflow.com/questions/30245767/are-user-acceptance-test-uat-and-end-to-end-e2e-test-the-same-thing

I think the definition by Steve Freeman is most consistent with what we do at Pluralsight.

- Acceptance: Does the whole system work?
- Integration: Does our code work against code we can't change?
- Unit: Do our object do the right thing, are they convenient to work with?

You'll see other definitions. Common ones I've seen:
E2E usually written by a QA team. Automated.
Acceptance (usually UAT - User Acceptance Testing) is usually manual, by some business user checking that requirements are met

# Ideas

- Forgot to map underscore column names to camel case model fields. Where should that be tested?
