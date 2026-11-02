# RallyGPXMerger persistence server

The server is a small Express 5 and TypeScript application. It stores plans as
JSON files in a local `plans/` directory.

## Local setup

From the `server/` directory:

```bash
npm install
npm run dev
```

The development command runs `src/server/server.ts` with `nodemon`. The server
listens on port `3004`. A production build can be created and started with:

```bash
npm run build
npm start
```

The server creates `plans/` on startup if it does not exist. Plan files and
local environment files are deployment data and must not be committed.

## HTTP API

The frontend currently uses `https://hase.uber.space/bike` as its API base URL.
The Express application defines these routes:

| Method   | Route                   | Purpose                                     |
| -------- | ----------------------- | ------------------------------------------- |
| `GET`    | `/bike/:id`             | Load a plan without its admin token         |
| `POST`   | `/bike/`                | Create a plan and return a generated UUID   |
| `PUT`    | `/bike/:id`             | Replace a plan when its admin token matches |
| `DELETE` | `/bike/:id/:adminToken` | Delete a plan when its admin token matches  |

JSON request bodies are limited to 50 MB. CORS headers allow the deployed
frontend to call the service. Public reads do not expose the admin token;
updates and deletion require the token stored with the plan.

## Deployment

The backend is deployed separately from the static frontend. A deployment must
provide the compiled server output, `package.json`, `package-lock.json`, and a
writable working directory for `plans/`. Start the compiled service with
`npm start` under the host's process supervisor.

The frontend deployment is documented in `docs/07_deployment_view.md` and is
automated by the repository's GitHub Actions workflow.


## Handling
# Setup

## Required Node Version
v18

## Setup
```npm install```

You need a couchDb database running
Enter your password in a file named `.env`, you find a file named `.env.example` which you can rename and enter your db password

```npm run dev```


```/server$ scp -r ./dist/ uber:/home/hase/bike/```
```/server$ scp -r ./package.json uber:/home/hase/bike/```
```/server$ scp -r ./package-lock.json uber:/home/hase/bike/```
```/server$ scp -r ./.env.production uber:/home/hase/bike/dist/```

The .env file has to live in the dist folder

package json and lock json have to be in the folder as well.

How to install a uber app?
* copy the dist to the server
* copy package json and lock.json to the folder
* Install the dependencies
* maybe replace the env variables
* create a new deamon file (.ini) in ~/etc/services.d


Create a Service¶

To create a new service, place a .ini file for each new service in ~/etc/services.d/. So if you want to add a service called my-daemon that runs an executable located at /home/isabell/bin/my-daemon, place the file my-daemon.ini in ~/etc/services.d/ and edit it:

[program:my-daemon]
command=/home/isabell/bin/my-daemon
startsecs=60

Afterwards, ask supervisord to look for the new my-daemon.ini file:

[isabell@stardust ~]$ supervisorctl reread
my-daemon: available

And then start your daemon:

[isabell@stardust ~]$ supervisorctl update
my-daemon: added process group

See here: https://manual.uberspace.de/daemons-supervisord/

# Routing
https://manual.uberspace.de/web-backends/#debugging

uberspace web backend list

supervisorctl start biked-daemon
supervisorctl stop biked-daemon

# Logs
cat ~/logs/....
