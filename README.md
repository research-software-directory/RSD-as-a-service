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

## Our mission: To promote the visibility, impact and reuse of research software

This repo contains the new RSD-as-a-service implementation. The service can be found at: https://research-software-directory.org

## Badges

| [fair-software.nl](https://fair-software.nl/) recommendations | |
| :-- | :--  |
| (1/5) code repository              | [![GitHub repo badge](https://img.shields.io/badge/github-repo-000.svg?logo=github&labelColor=gray&color=blue)](https://github.com/research-software-directory/RSD-as-a-service) |
| (2/5) license                      | [![GitHub license](https://img.shields.io/badge/license-Apache--2.0%20-blue.svg)](https://github.com/research-software-directory/RSD-as-a-service/blob/main/LICENSE) |
| (3/5) community registry           | [![Research Software Directory](https://img.shields.io/badge/rsd-RSD--as--a--service-00a3e3.svg)](https://research-software-directory.org/software/rsd-ng) |
| (4/5) citation                     | [![DOI](https://zenodo.org/badge/413814951.svg)](https://zenodo.org/badge/latestdoi/413814951) |
| (5/5) checklist                    | [![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/6336/badge)](https://bestpractices.coreinfrastructure.org/projects/6336) |
| overall                            | [![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8F-yellow)](https://fair-software.eu) |
| **Other best practices**           | &nbsp; |
| Contributor covenant               | [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md) |
| Citation metadata consistency      | [![cffconvert](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/cff_validate.yml/badge.svg)](https://github.com/nlesc/python-template/actions/workflows/cffconvert.yml) | 
| Linting and codestyle              | [![Linting and codestyle](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/prettier-check-frontend.yml/badge.svg)](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/prettier-check-frontend.yml) |
| **Tests**                          | &nbsp; |
| Frontend                           | [![Frontend tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/frontend_tests.yml/badge.svg)](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/frontend_tests.yml) | 
| Backend                            | [![Backend tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/backend_tests.yml/badge.svg)](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/backend_tests.yml) |
| Authentication                     | [![Authentication tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/authentication_tests.yml/badge.svg)](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/authentication_tests.yml) | 
| Scrapers                           | [![Scraper tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/scrapers_tests.yml/badge.svg)](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/scrapers_tests.yml) | 
| End-to-end                         | [![E2E tests Chrome](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/e2e_tests_chrome.yml/badge.svg)](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/e2e_tests_chrome.yml) |
| **Test coverage**                  | &nbsp; |
| Frontend                           | [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rsd-frontend&metric=coverage)](https://sonarcloud.io/summary/overall?id=rsd-frontend) | 
| Backend                            | &nbsp; |
| Authentication                     | [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nl.research-software%3Aauthentication&metric=coverage)](https://sonarcloud.io/summary/overall?id=nl.research-software%3Aauthentication) |
| Scrapers                           | [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nl.research-software%3Ascrapers&metric=coverage)](https://sonarcloud.io/summary/overall?id=nl.research-software%3Ascrapers) |

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
