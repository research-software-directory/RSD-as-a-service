<!--
SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2021 - 2022 Jason Maassen (Netherlands eScience Center) <j.maassen@esciencecenter.nl>
SPDX-FileCopyrightText: 2021 - 2022 dv4all
SPDX-FileCopyrightText: 2021 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2021 - 2024 Netherlands eScience Center
SPDX-FileCopyrightText: 2021 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences

SPDX-License-Identifier: CC-BY-4.0
-->

# RSD-as-a-service

![image](https://user-images.githubusercontent.com/4195550/136156498-736f915f-7623-43d2-8678-f30b06563a38.png)

[![DOI](https://zenodo.org/badge/413814951.svg)](https://zenodo.org/badge/latestdoi/413814951)
[![Research Software Directory](https://img.shields.io/badge/rsd-RSD--as--a--service-00a3e3.svg)](https://research-software-directory.org/software/rsd-ng)
[![GitHub license](https://img.shields.io/badge/license-Apache--2.0%20-blue.svg)](https://github.com/research-software-directory/RSD-as-a-service/blob/main/LICENSE)
[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F-yellow)](https://fair-software.eu)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/6336/badge)](https://bestpractices.coreinfrastructure.org/projects/6336)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)
![Frontend tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/frontend_tests.yml/badge.svg)
![Backend tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/backend_tests.yml/badge.svg)
![Scraper tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/scrapers_tests.yml/badge.svg)
![E2E tests Ubuntu](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/e2e_tests_ubuntu.yml/badge.svg)
![E2E tests Firefox](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/e2e_tests_firefox.yml/badge.svg)
![E2E tests Chrome](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/e2e_tests_chrome.yml/badge.svg)
![E2E tests MacOS](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/e2e_tests_macos.yml/badge.svg)

## Our mission: To promote the visibility, impact and reuse of research software

This repo contains the new RSD-as-a-service implementation. The service can be found at: https://research-software-directory.org  

## How to build and run the RSD

### Building from source code

1. Before installing the dependencies ensure that you have `docker` and `docker compose` V2 (see the [documentation of Docker Compose](https://docs.docker.com/compose/compose-v2/)) locally.
2. You will also need `make` and [`yarn`](https://yarnpkg.com) to automate the configuration and installation process.
3. Set the required environment variables:
   Copy the file `.env.example` to `.env` file at the root of the project
   and fill the secrets and passwords. Check if the secrets are correct.
   The `Makefile` will take care about creating an appropriate `frontend/.env.local`
   from the `.env` file.
4. Run `make install` to install all dependencies and build the docker images.

### Running the services

```
# Start the containers via the make file
make start
# OR directly use docker compose
docker compose up
```

### Stopping the services

```
# Stop all services via the makefile
make stop
# OR directly use docker compose
docker compose down
```

## Developing the frontend

You can run frontend in development mode as docker a service (called frontend-dev) that enables hot reloading. By default this frontend-dev service will not be started automatically. For more detailed instructions see [frontend/README.md](frontend/README.md).

```
# Run frontend development using docker at http://localhost:3000
make frontend-dev
# OR use docker compose directly
docker compose -f docker-compose.yml -f docker-compose.dev.yml up 
```

It is possible to directly run the frontend too (without using a docker container). You must then have NodeJS installed, preferably v18.

```
# Build and install all dependencies.
make install
# Run the frontend and the documentation on localhost:3000 and localhost:3030
make dev
# Stop all services with `docker compose down`
make down
```

## License

The content of this repository is licensed under several licenses. We follow the [REUSE specification](https://reuse.software/) to indicate which license applies to the files specifically. Here are some general hints:

- Source code is licensed under `Apache-2.0`
- Documentation and most images are licensed under `CC BY-4.0`
- Some files with trivial content, e.g. configuration files, are licensed under `CC0-1.0`

For more details on the licenses, please have a look at the file headers or associated `*.license` files. The terms of all used licenses are located in the [LICENSES](./LICENSES/) directory.
