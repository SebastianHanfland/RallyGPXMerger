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
