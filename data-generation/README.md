<!--
SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2024 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Data generation

This module can populate a running RSD instance with fake data. It is intended to run against an empty RSD and is intended for **development purposes only**.

It is written in JavaScript and is meant to run with [Node.js](https://nodejs.org/en). See the file `package.json` for more information.

## Running

To run this locally when you have a running RSD, first install the dependencies with `npm install` from this directory. Then can run `npm run start`. The program expects two environment variables:

-   `POSTGREST_URL`: The URL at which the PostgREST API can be reached. If missing, it will default to `http://localhost/api/v1`, which is in most cases correct.
-   `PGRST_JWT_SECRET`: This should be the same as set in your `.env` file.

Alternatively, you can also run this with `docker compose` simultaneously with the RSD. It is disabled by default (see the `data-generation` entry at the `docker-compose.yml` file at the root of the project), so you should run `docker compose up --scale data-generation=1` to enable it.

## Contributing

We use [Prettier](https://prettier.io/) for source code formatting. See the file `.prettierrc` for the applied [configuration options](https://prettier.io/docs/en/options) and see the file `.prettierignore` for files that should be [ignored](https://prettier.io/docs/en/ignore) by Prettier. Please make sure your contributions are compliant with Prettier. You can run `npm run format:check` to see which files are not compliant and `npm run format:fix` to fix them. A GitHub workflow runs on every pull request to check if all files are formatted properly.
