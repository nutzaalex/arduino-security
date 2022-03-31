### Node server for Arduino app

## Quick Start

### Prerequisites:
  * git
  * [nvm](https://github.com/creationix/nvm)
  * yarn

### Installation
``` bash
clone repo
$ cd arduino-security
$ cd server
$ nvm install # install  correct version of node (see .nvmrc)
$ nvm use
$ yarn install # install project's dependencies
$ yarn run dev # run development server; it automagically restarts when files change
```

### Run server in production mode
```bash
$ yarn run start
```
