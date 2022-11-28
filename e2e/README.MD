<!--
SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2021 - 2022 dv4all

SPDX-License-Identifier: Apache-2.0
SPDX-License-Identifier: CC-BY-4.0
-->

# End to end testing with Playwright

The project uses Playwright for end-to-end tests.

## Running end to end tests

Use `make e2e-test` from the root. It will perform all docker-compose tasks and run all tests.

To run using the separate steps:

- Run RSD on the localhost using docker-compose

```bash
# build
docker-compose build
# start in detached
docker-compose up -d
```

- Run e2e tests using docker-compose from e2e folder

```bash
# navigate to e2e folder
cd e2e
# build tests
docker-compose build
# start tests
docker-compose up
```

## View test report

To view html test report you need to install all dependencies runnin `npm install`. The reports are saved in the playwright-report folder.

```bash
# run html test report
npm run e2e:report
```

## Writing tests

When wrighting end to end tests it is required to run installation locally.

### Installation

Run `npm install` from e2e rooot directory to install all dependencies.

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

- `helpers`: place for helper functions and reusable functions
- `images`: example images used for testing image upload
- `mocks`: the data used in the tests to create software, project, organisation etc.
- `state`: the browser state after loging in to RSD. It makes possible to login at the start (see helpers/globalSetup.ts) and reuse login credentials for all tests
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
