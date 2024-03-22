<!--
SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2024 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# CodeMeta server

This module implements a [CodeMeta](https://codemeta.github.io/) server, using [V3](https://w3id.org/codemeta/v3.0) of the schema.

If your instance of the RSD is hosted on https://example.com/, you can access the CodeMeta server on https://example.com/codemeta/v3/. To get the CodeMeta data for a software page, just append its slug to this URL. For example, to get the CodeMeta data for software page on https://example.com/software/some-software, visit https://example.com/codemeta/v3/some-software/.

## Developing

This module is written in Go, version 1.22.1. You can find the installation instruction [here](https://go.dev/doc/install). If this page lists a newer version than the one we use, you can find all versions [here](https://go.dev/dl/). We currently don't have any external dependencies, except [Pico CSS](https://picocss.com/), which is dynamically linked in the HTML.

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
