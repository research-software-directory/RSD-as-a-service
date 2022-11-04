<!--
SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 Netherlands eScience Center
SPDX-FileCopyrightText: 2022 dv4all

SPDX-License-Identifier: CC-BY-4.0
-->

# Authentication module

This module handles authentication from third parties using oAuth2 and OpenID.

## Environment variables
Check `.env.example` to see which environment variables are needed. 

## Developing locally
If you want to develop and run the auth module locally, i.e. outside of Docker, you have to make two changes to files tracked by Git.
1. In `docker-compose.yml`, add the following lines to the `nginx` service:
```yml
extra_hosts:
  - "host.docker.internal:host-gateway"
```
2. In `nginx.conf`, replace `server auth:7000;` with `server host.docker.internal:7000;`

Remember to undo these changes before committing!

It is recommended to use the [envFile plugin](https://plugins.jetbrains.com/plugin/7861-envfile)  of IntelliJ IDEA to load your `.env` file.
Furthermore, set the value of `POSTGREST_URL` to `http://localhost/api/v1`.

## Running the tests

You can run the tests by executing the docker build in this directory:

```bash
docker build -t removeme .
# resulting image can be deleted afterwards:
# docker image rm removeme
```
