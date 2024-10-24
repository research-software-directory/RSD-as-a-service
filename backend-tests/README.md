<!--
SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Backend tests

This folder contains backend tests for the RSD. It is intended to mainly:
- test the correctness of row level security rules
- test the correctness of remote procedure calls (no tests yet)
- load test the backend/database (no tests yet)

## Tech stack

This module is written in Java as a Maven project.
To help with testing REST endpoints, we make use of [REST Assured](https://rest-assured.io/), which has its documentation [here](https://github.com/rest-assured/rest-assured/wiki/Usage).
As a testing framework we use [JUnit 5](https://junit.org/junit5/).

## Principles

Tests should be written taking the following principles in account:
- each test should be runnable independently of other tests
- each test should be repeatable, without e.g. having to clean up the database first

## Contributing

This module uses [EditorConfig](https://editorconfig.org/) for basic formatting. Please check if your editor [already supports EditorConfig](https://editorconfig.org/#pre-installed) or if you need to [install a plugin](https://editorconfig.org/#download). A GitHub workflow is run on every PR to check if any files violate the formatting settings.

## Writing tests

Each class containing tests should be annotated with `@ExtendWith({SetupAllTests.class})`. This refers to a class containing a global setup method, which runs once to check the connection to the database and to initialise global parameters.

## Running

### From the command line

This section assumes that you are in the root directory of the project.

The easiest way to run the tests is with `make`. Make sure no other RSD containers are running.

```shell
make run-backend-tests
```

You can also run the tests directly with `docker compose`.
```shell
docker compose --file backend-tests/docker-compose.yml down --volumes && \
docker compose --file backend-tests/docker-compose.yml build --parallel && \
docker compose --file backend-tests/docker-compose.yml up
```
This leaves the containers running, so you can inspect the database if necessary. To clean up run
```shell
docker compose --file backend-tests/docker-compose.yml down --volumes
```

### From an IDE
If you use an IDE that supports [JUnit](https://junit.org/junit5/), you can run each test manually against a running RSD instance (that you started with e.g. `make start`).
Make sure to have set the following environment variables:
- `POSTGREST_URL`
- `PGRST_JWT_SECRET`

Check your `.env` file for the values, but you should **EXPLICITELY** add the port number to `POSTGREST_URL` (which is most likely `80`).
