<!--
SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2021 - 2022 Jason Maassen (Netherlands eScience Center) <j.maassen@esciencecenter.nl>
SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
SPDX-FileCopyrightText: 2021 - 2022 dv4all
SPDX-FileCopyrightText: 2021 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences

SPDX-License-Identifier: CC-BY-4.0
-->

# RSD-as-a-service

![image](https://user-images.githubusercontent.com/4195550/136156498-736f915f-7623-43d2-8678-f30b06563a38.png)

[![DOI](https://zenodo.org/badge/413814951.svg)](https://zenodo.org/badge/latestdoi/413814951)
[![GitHub license](https://img.shields.io/badge/license-Apache--2.0%20-blue.svg)](https://github.com/research-software-directory/RSD-as-a-service/blob/main/LICENSE)
[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8B-orange)](https://fair-software.eu)
![All tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/tests_main.yml/badge.svg)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

## Our mission: To promote the visibility, impact and reuse of research software

This repo contains the new RSD-as-a-service implementation

## Building

The program can easily be built with `docker-compose`. Each service builds the image using specific version (see docker-compose.yml file). Ensure that the version number is increased in the `docker-compose.yml` file when the source code of that service is changed.

### Environment variables

The environment variables should be stored in .env file, which is automatically loaded by docker-compose. To validate loading of env variables use `docker-compose config`. More info about use of enviroment variables in docker-compose is available at [official documentation](https://docs.docker.com/compose/environment-variables/)

- copy the file `.env.example` to `.env` file at the root of the project

```bash
# from project root dir
cp .env.example .env
```

- `provide missing values in .env file (secrets)`
- build local images

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

The application can be viewed on http://localhost

### Frontend with hot-module-replacement (HMR)

To run frontend in the development mode with the hot-module-replacement (HMR) you should start additional instance of the frontend which will be available at http://localhost:3000

```bash
# navigate to frontend folder
cd frontend
# install dependencies
yarn install
# start fe in dev mode
yarn dev
```

More information about frontend setup is [available in the frontend readme file](/frontend/README.md).

## Clear/remove data (reset)

To clear the database, if the database structure has changed or you need to run data migration again, run the command:

```bash
docker-compose down --volumes
```

## Data migration

A data migration script is available to migrate data from the legacy RSD to the new one:

- run current RSD solution using `docker-compose up` from the root of the project
- run the migration script using docker-compose file in the data-migration folder

```bash
# navigate to data-migration folder
cd data-migration
# run data migration docker-compose file
docker-compose up
```

More information about [data migration is avaliable here](data-migration/README.md).

## License

The content of this repository is licensed under several licenses. We follow the [REUSE specification](https://reuse.software/) to indicate which license applies to the files specifically. Here are some general hints:

- Source code is licensed under `Apache-2.0`
- Documentation and most images are licensed under `CC BY-4.0`
- Some files with trivial content, e.g. configuration files, are licensed under `CC0-1.0`

For more details on the licenses, please have a look at the file headers or associated `*.license` files. The terms of all used licenses are located in the [LICENSES](./LICENSES/) directory.
