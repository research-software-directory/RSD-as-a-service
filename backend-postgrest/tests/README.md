<!--
SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2022 dv4all
SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2023 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Deprecated
This folder is deprecated in favor of using the tests in the folder `backend-tests`.
This folder is kept here to see which old tests were used, but might be deleted in the future.

# Research Software Directory (RSD) - PostgREST tests

This service can automatically be build and started with `docker compose`. It does not work in conjunction with the `data-migration` service. It also assumes that the database is empty at the start.

The service runs its tests using the `newman` npm package. Postman can be used as a GUI for running and editing tests by importing the json file from this directory.

In order to use the collection on Postman, you need to set two (global) variables first:

* `jwt_secret` should have the same value as `PGRST_JWT_SECRET` (as is used by PostgREST)
* `backend_url` should have the value of the PostgREST url, currently `http://localhost/api/v1`

## Build test container

```bash
docker compose build
```

## Run test locally

From the backend-postgrest/tests directory run the following `docker compose` command. It will run tests and remove containers and volumes after performing the tests.

```bash
# run test and clean up the containers on exit
docker compose up \
  --abort-on-container-exit \
  --exit-code-from postgrest-tests \
  && docker compose down --volumes
```
