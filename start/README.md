# Getting Started

- Docker
- Node (check .nvmrc for version, or just use nvm)
- Bash

Running other stuff in Docker? Easy way to stop it: `docker ps -q | xargs docker stop`

Run all of the following from `dev-scripts`

- Setup Environment: `setup-environment.sh`
- Start Everything: `start.sh`
- View all orders: Open http://localhost:3000/orders in a browser.
