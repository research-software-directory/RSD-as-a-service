<!--
SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2021 - 2023 dv4all
SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)

SPDX-License-Identifier: Apache-2.0
SPDX-License-Identifier: CC-BY-4.0
-->

# End to end testing with Playwright

The project uses Playwright for end-to-end tests.

## Running end to end tests

Use `make e2e-test` from the root. It will perform all docker compose tasks and run all tests.

To run using the separate steps:

- Run RSD on the localhost using docker compose

```bash
# build
docker compose build
# start in detached
docker compose up --detach
```

- Run e2e tests using docker compose from e2e folder

```bash
# navigate to e2e folder
cd e2e
# build tests
docker compose build
# start tests
docker compose up
```

## View test report

To view html test report you need to install all dependencies running `npm install`. The reports are saved in the playwright-report folder.

```bash
# run html test report
npm run e2e:report
```

## Writing tests

When writing end to end tests it is required to run installation locally.

### Installation

Run `npm install` from e2e root directory to install all dependencies.

### Scripts

See package.json for the complete list of scripts.

```bash
# run test in all browsers (without showing)
npm run e2e:all
# run tests in chrome headed
npm run e2e:chrome
# run tests in firefox headed
npm run e2e:ff
# run tests in webkit headed
npm run e2e:webkit
# record
npm run e2e:record
```

### Folder structure

- `generate`: test scripts to generate json responses for mocked api endpoints (organsations and mentions)
- `helpers`: place for helper functions and reusable functions
- `images`: example images used for testing image upload
- `mocks`: the data used in the tests to create software, project, organisation including mocked api responses.
- `state`: the browser state after logging in to RSD. It makes possible to login at the start (see helpers/globalSetup.ts) and reuse login credentials for all tests
- `tests`: place for (main) test files. The files have pattern `*.spec.ts`

Note! Playwright runs test files in parallel. When you need sequential process use configuration mode `serial`. See software.spec.ts line 10.

### Dependencies

In case you need to install all dependencies manually

```bash
# playwright
npm -i -D @playwright/test
# node types
npm -i -D @types/node
# install browsers
npx playwright install --with-deps
# install linter
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Generating mocked api responses (ROR/organisations and mentions requests)

When adding organisations or references to research publications for software (mentions) and projects (input/output) RSD needs to make api calls to ror.org, doi.org, crossref and datacite api's. These calls prove to be "heavy" and less reliable when executed as e2e tests in CI.

To improve e2e tests reliability and reduce dependency on external api availability the json response can be generated once and then reused during test. The json data is saved in mocks/data folder. 

### How to generate data files

The specific tests are created for generating json files. These test files are in generate folder.

1. **Start RSD**

```bash
# start RSD locally (so test can run)
docker compose up --detach
```

2. **Start generate script to create all mocked api responses for chrome tests**

```bash
# navigate to e2e folder
cd e2e
# NOTE! you might need to install dependencies
npm install
# run generate script
npm run e2e:generate
```
