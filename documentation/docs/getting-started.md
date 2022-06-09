<!--
SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Getting Started

## Dependencies

To run the application locally you need to install the following dependencies:

*   Docker

## Get Started

### Monorepo

The RSD-as-a-Service project is a divided into different services included in the mono repo:

|-- authentication  
|-- backend-postgrest  
|-- data-migration  
|-- database  
|-- deployment  
|-- documentation  
|-- frontend  
|-- nginx  
|-- scrapers

### Environment variables

The environment variables should be stored in a .env file, which is automatically loaded by docker-compose. To validate loading of env variables use `docker-compose config`. More info about the use of environment variables in docker-compose is available at [official documentation](https://docs.docker.com/compose/environment-variables/)

*   copy the file `.env.example` to `.env` file at the root of the project

```bash
# from project root dir
cp .env.example .env
```

*   You need to modify the new .env file with the corresponding value secrets.
*   build local images

```bash
# from project root dir
docker-compose build
```

## Running locally

Run the command `docker-compose up`.

```bash
# from project root dir
docker-compose up
```

The application can be viewed at http://localhost

### Frontend with hot-module-replacement (HMR)

To run the frontend in the development mode with the hot-module-replacement (HMR) you should start an additional instance of the frontend which will be available at http://localhost:3000

```bash
# navigate to frontend folder
cd frontend
# install dependencies
yarn install
# start fe in dev mode
yarn dev
```

More information about the frontend setup is [available in the frontend readme file](/frontend/README.md).

### Documentation site

The documentation site runs on GitHub Pages. Any changes inside this folder will trigger a GitHub action to deploy the changes automatically when merging a Pull Request to the main branch.

To run locally the documentation site, you need `nodejs` installed on your machine.

```bash
# navigate to frontend folder
cd documentation
# install dependencies
yarn install
# start fe in dev mode
yarn dev
```

All documentation files written in Markdown are placed inside the `./documentation/docs/` folder.

You can edit the `navigation bar` and the `sidebar` from the `./doumentation/docs/.vuepress/config.js` file.

Any file `markdown file` added indie the `docs` folder will be available on built time.

## Clear/remove data (reset)

To clear the database, if the database structure has changed or you need to run data migration again, run the command:

```bash
docker-compose down --volumes
```

## Data migration

A data migration script is available to migrate data from the legacy RSD to the new one:

*   run current RSD solution using `docker-compose up` from the root of the project
*   run the migration script using docker-compose file in the data-migration folder

```bash
# navigate to data-migration folder
cd data-migration
# run data migration docker-compose file
docker-compose up
```

More information about [data migration is available here](data-migration/README.md).

## Tech Stack

![image](/rsd-stack-220304.png)
