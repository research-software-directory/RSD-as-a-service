<!--
SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2022 dv4all

SPDX-License-Identifier: CC-BY-4.0
-->

# Authentication module

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nl.research-software%3Aauthentication&metric=coverage)](https://sonarcloud.io/summary/overall?id=nl.research-software%3Aauthentication)

This module handles authentication from third parties using oAuth2 and OpenID.

## Environment variables
Check `.env.example` to see which environment variables are needed. In particular, look for the env variable `RSD_ENVIRONMENT` to allow for easy admin creation when developing and testing out the RSD (this is not safe for production!).

## Contributing

This module uses [EditorConfig](https://editorconfig.org/) for basic formatting. Please check if your editor [already supports EditorConfig](https://editorconfig.org/#pre-installed) or if you need to [install a plugin](https://editorconfig.org/#download). A GitHub workflow is run on every PR to check if any files violate the formatting settings.

## Developing locally
If you want to develop and run the auth module locally, i.e. outside of Docker, you have to make two changes to files tracked by Git.
1. In `docker-compose.yml`, add the following lines to the `nginx` service:
```yml
extra_hosts:
  - "host.docker.internal:host-gateway"
```
2. In `nginx.conf`, replace `server auth:7000;` with `server host.docker.internal:7000;`
3. (Optional) For refreshing your tokens to work, set `RSD_AUTH_URL=http://nginx/auth` in your `.env`.
4. (Optional) Allow TCP traffic on port 7000 of your firewall if signing in seems to hang forever or if you get `504 Gateway Timeout` responses.

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
