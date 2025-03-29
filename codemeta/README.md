<!--
SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# CodeMeta

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rsd-codemeta&metric=coverage)](https://sonarcloud.io/summary/overall?id=rsd-codemeta)

## CodeMeta server

This module implements a [CodeMeta](https://codemeta.github.io/) server, using [V3](https://w3id.org/codemeta/v3.0) of the schema.

If your instance of the RSD is hosted on https://example.com/, you can access the CodeMeta server on https://example.com/metadata/codemeta/v3/. To get the CodeMeta data for a software page, just append its slug to this URL. For example, to get the CodeMeta data for software page on https://example.com/software/some-software, visit https://example.com/metadata/codemeta/v3/some-software/.

## Developing

This module is written in Go, version 1.22.5. You can find the installation instruction [here](https://go.dev/doc/install). If this page lists a newer version than the one we use, you can find all versions [here](https://go.dev/dl/). We currently don't have any external dependencies, except [Pico CSS](https://picocss.com/), which is dynamically linked in the HTML.

When developing and running it locally, you need a locally running RSD instance, and you should set the `POSTGREST_URL` environment variable to a value at which the PostgREST backend can be reached. This will probably be `http://localhost/api/v1`. You can also point it to a dev or production server instead.

To build the module, open a terminal in the `codemeta` directory and run

```shell
go build
```

This should produce an executable called `codemeta`. Run it with

```shell
POSTGREST_URL=http://localhost/api/v1 ./codemeta
```

You can then access the service on http://localhost:8000/v3/

You can also use an IDE to build and run it more easily.

## Scraper

For CodeMeta scrapers to work, when running the RSD, the `codemeta` container must also run (note that this scraper is _not_ part of the `scrapers` service). This is the default, no action needed, but don't use `--scale codemeta=0`.

### 4TU scraper

This scraper collects software from https://data.4tu.nl/.

The scraper is scheduled to run once per day, see `jobs.cron` for the time. The scraper can also be activated manually with `docker compose exec codemeta /usr/local/bin/scraper-4tu`.

Furthermore, in order for the scraper to do anything, you must have in your `.env` the key `ENABLE_4TU_SCRAPER` with value `true` (case sensitive), see also the file `.env.example`.

The 4TU scraper will automatically try to assign any software it finds to the community with slug `4tu` if it exists. If such a community does not exist, it will silently skip this step.
