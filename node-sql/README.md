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