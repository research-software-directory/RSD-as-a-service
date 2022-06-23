<!--
SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2022 dv4all

SPDX-License-Identifier: CC-BY-4.0
-->

# Authentication module

This modules handles authentication from third parties using oAuth2 and OpenID.

## Environment variables

It requires the following variables at run time.

```env
# connection to backend
POSTGREST_URL=

# SURFconext
NEXT_PUBLIC_SURFCONEXT_CLIENT_ID=
NEXT_PUBLIC_SURFCONEXT_REDIRECT=
AUTH_SURFCONEXT_CLIENT_SECRET=

# JWT secret for postgREST
PGRST_JWT_SECRET=
```

## Running the tests

You can run the tests by executing the docker build in this directory:

```bash
docker build -t removeme .
# resulting image can be deleted afterwards:
# docker image rm removeme
```
