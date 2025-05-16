<!--
SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2021 - 2023 dv4all
SPDX-FileCopyrightText: 2022 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Research Software Directory (RSD) - Frontend

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rsd-frontend&metric=coverage)](https://sonarcloud.io/summary/overall?id=rsd-frontend)

Based on the features in the legacy application and the current requirements we selected [Next.js](https://nextjs.org/docs) and MUI-7 (https://mui.com/getting-started/usage/) frameworks for:

- Easy integration with generic SSO oAuth services like ORCID, SURFconext, Microsoft etc.
- SEO support for custom meta tags and dynamic build sitemap.xml file
- Rapid development of user interface, in particular, the input/admin pages of the legacy application require improvements

## Development

### Locally running frontend in dev mode

- install dependencies `npm install`
- create `.env.local` file. Use `.env.example` from the project root as template.
- run all app modules `docker compose up`
- open another terminal and run `npm run dev` to start frontend in development mode

### Frontend dev mode via Docker

**Use this if you are using a custom theme and mount files from the `/deployment` directory**

First, add the folders that contain the custom configuration to the `docker-compose.dev.yml`:

```yml
services:
  frontend:
    #   .....
    volumes:
      - ./frontend:/app
      # Replace the following directory with the custom deployment directory
      - ./deployment/rsd:/app/public
```

You can start the frontend in dev mode inside Docker using the `Makefile`. The command will make sure that the created Docker container uses a user with the same user id and group id as your local account. This ensures that you will be the owner of all files that are written via mounted volumes to your drive (mainly everything in the `frontend/.next` and `frontend/node_modules` folders).

```bash
make frontend-dev
```

Alternatively you can run

```bash
# Export your user and group ids to the variables so Docker will correctly build the frontend-dev container. This is required only if you build the container
export DUID=$(id -u)
export DGID=$(id -g)
docker compose -f docker-compose.yml -f docker-compose.dev.yml build frontend
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Environment variables

For oAuth implementation we need env variables. From the project root directory, copy `.env.example` file to `frontend/.env.local` and provide the values See [next documentation page for more info](https://nextjs.org/docs/basic-features/environment-variables).

- `.env.local` contains secrets when running frontend in local development (`npm run dev`). This file is not in the repo. You will need to create it and add secrets to it. There is one difference from basic .env file.

```env
# postgREST api
# cosumed by services: authentication,frontend,auth-tests
# .env.local: http://localhost/api/v1, .env.production.local: http://backend:3500
POSTGREST_URL=http://localhost/api/v1
```

## Folders

- `__tests__`: unit test for **pages only**. Unit tests for the components are in the same directory as components.
- `assets`: images and icons. These are imported into the components. In case of SVG images, the content is used to create an icon component.
- `components`: all custom components created in this project are stored in this folder.
- `config`: place for configuration objects. For example, menu items are stored here.
- `pages`: next specific, pages and api endpoints. For more information [see official documentation](https://nextjs.org/docs/routing/introduction)
- `public`: folder for public assets of the website. For example favicon.ico file and robots.txt are stored here. The root of the public folder is equivalent to the root on the webserver. Note that react file at `page/index.tsx` represents the template for the root webpage.
- `styles`: folder for css files and MUI theme objects. Read specific [readme file about theming](./styles/README.md).
- `types`: folder for typescript type objects. Note! specific, not-shared types are (preferably) stored within component file
- `utils`: folder for utility functions, hooks, composables etc.

## Material UI (v7)

The integration between Next.js and MUI-5 is based on [official example](https://github.com/mui-org/material-ui/tree/master/examples/nextjs).
More explanation concerning the official example can be found in [this video](https://www.youtube.com/watch?v=IFaFFmPYyMI&t=597s)

Most important point concerning Next is integration in template files: \_app.tsx, \_document.tsx

### Theming

Customization in MUI5 is done using [theme object](https://mui.com/customization/theming/).
The theme is provided at the root React component using Theme context provider.
In short, add theme provider to \_app.tsx file

## Tailwind CSS

In addition to MUI-5, the team prefers to use Tailwind CSS for global application layout.

```bash
# install dev dependencies
npm install --save-dev tailwindcss@latest postcss@latest autoprefixer@latest
```

Steps performed:

- extracted MUI-5 theme into separate object
- created tailwind.config.js and defined to use shared theme definitions
- created postcss.config.js and added tailwind to it
- added @tailwind mixins to styles/global.css
- created styles/tailwind.css for tailwind specific utilities (e.g. @apply)

### Integration between Tailwind and MUI-5 themes

The integration is based on [this article](https://medium.com/@akarX23/a-full-setup-of-next-js-with-redux-tailwind-material-ui-pwa-and-docker-c33bdceadce5).

## Authentication

For authentication, we use a custom module which integrates with our auth service. The frontend code is in `frontend/auth` folder and the auth service is in `authentication` folder.

## Unit testing

For unit testing we use [jest](https://jestjs.io/docs/getting-started) and [react testing library](https://testing-library.com/docs/react-testing-library/intro/).
There are several practices that the React Testing Library promotes:

- Avoid testing internal component state
- Testing how a component renders

The setup is performed according to [official Next documentation](https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler). We use rust compiler instead of babel setup.

### Unit testing scripts

- `npm run test:watch`: to run test in watch mode. The tests will run on each change in the test/component file(s)
- `npm run test:coverage`: to run tests and show the test coverage report. This script is used in GH action.
- `npm run test:memlimit`: for minimal memory consumption. When basic test scripts **npm run test** and **npm run test:coverage** causing the memory overflow on your machine use this script to limit the number of concurrent workers and memory usage.
- `npm run test:memory`: for examining memory usage during the tests. In node version 18 (and 16) some changes are made in V8 engine memory management that cause the memory leaks when running tests with Jest. See [issue](https://github.com/facebook/jest/issues/11956)

### Setup steps performed

```bash
# install dependencies
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# install whatwg-fetch to address next-auth fetch requests on node js (node-fetch)
npm install --save-dev whatwg-fetch

```

- create jest.config.js file and paste content from next instructions
- crate jest.setup.ts file and paste this content.

```javascript
// isomorphic fetch suport for Node
// required to support fetch with Jest
import "whatwg-fetch";
// specific
import "@testing-library/jest-dom/extend-expect";
```

## Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Intercepting HTTP requests

It can be useful to intercept HTTP requests made by the Next.js server in order to identify potential bottlenecks and to see if the requests made are correct. In order to do so, add the following snippet to the end of `frontend/pages/_app.tsx`:

```javascript
function replaceFetch(originalFetch: any) {
  const newFetch = async function (url: any, conf: any) {
    const tik = Date.now()
    const resp = await originalFetch(url, conf)
    const tok = Date.now()

    if (conf) {
      // eslint-disable-next-line no-console
      console.log(`${tok - tik} ms for ${conf.method ?? 'GET'} for URL: ${url} with body ${conf.body ?? 'no body'}`)
    } else {
      // eslint-disable-next-line no-console
      console.log(`${tok - tik} ms for GET for URL: ${url}`)
    }
    return resp
  }

  global.fetch = newFetch
}

// @ts-expect-error will be removed later
if (!global.originalFetch) {
  const originalFetch = global.fetch
  // @ts-expect-error will be removed later
  global.originalFetch = originalFetch

  replaceFetch(originalFetch)
}

// because Next.js overwrites global.fetch again...
setInterval(() => {
  // @ts-expect-error will be removed later
  const originalFetch = global.originalFetch

  replaceFetch(originalFetch)
}, 10)
```

It will print each HTTP request and the time it took to complete.

## Updates and upgrades

Upgrading minor version changes can be usually done using `npm outdated` and `npm update`. Major updates are more demanding and might require changes in the source code.

Since RSD went live in August 2022 we started using exact versions in the package.json to avoid unexpected upgrades. This means that we manually check for outdated packages and perform "controlled" upgrades. At the same time we run security audits using `npm audit`.

### Next and React

```bash
# upgrade next, react and typescript
npm install next@latest react@latest react-dom@latest eslint-config-next@latest typescript
# upgrade types
npm install --save-dev @types/node @types/react @types/react-dom
```

### Material UI

```bash
# upgrade material ui
npm install @mui/material @mui/icons-material @emotion/react @emotion/server @emotion/styled
```

### Testing

```bash
# react testing lib
npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest jest@latest jest-environment-jsdom@latest @types/jest@latest
```

### Others

```bash
# cookie for tokens
npm install cookie
# type
npm install --save-dev @types/cookie
```

## Maintenance

For the maintenance we use [knip](https://knip.dev/overview/getting-started). It will show a list of unused files, dependencies, exported functions and types. Exclude definitions, specific to this project, are in `knip.jsonc`. Knip is able to identify next and use pages folder as entry points.

### Unused files

```bash
# execute in the frontend folder
npm run knip:files
```

Based on report validate that file are unused/not needed. To validate always run `npm run test` and `npm run build` to confirm that test are working and application can be build.

- Example report

```bash
> rsd-frontend@2.16.0 knip:files
> knip --include files

types/Invitation.ts
utils/getUnusedInvitations.ts
components/layout/MasonryGrid.tsx
components/layout/StatCounter.tsx
components/home/rsd/HomeSectionTitle.tsx
components/projects/edit/mentions/citations/NoCitationItems.tsx

```

### Unused exports

Show unused exported functions. **Note! This functions could be used in the file itself.**

```bash
npm run knip:exports
```

Based on report validate that types are unused/not needed. To validate always run `npm run test` and `npm run build` to confirm that test are working and application can be build.

- Example report

```bash
> rsd-frontend@2.16.0 knip:exports
> knip --include exports

getExpInMs                      function  auth/index.tsx:136:17
getWaitInMs                     function  auth/index.tsx:150:17
initSession                     unknown   auth/index.tsx:48:14
isMaintainerOfCommunity         function  auth/permissions/isMaintainerOfCommunity.ts:40:23
getCommunitiesOfMaintainer      function  auth/permissions/isMaintainerOfCommunity.ts:65:23
default                         unknown   auth/permissions/isMaintainerOfCommunity.ts:91:8
getMaintainerOrganisations      function  auth/permissions/isMaintainerOfOrganisation.ts:69:23
```

### Unused types

Show unused exported types.

```bash
npm run knip:types
```

Based on report validate that types are unused/not needed. To validate always run `npm run test` and `npm run build` to confirm that test are working and application can be build.

- Example report

```bash
> rsd-frontend@2.16.0 knip:types
> knip --include types

OrganisationCount             type  components/admin/organisations/apiOrganisation.tsx:21:13
SoftwareKeywordsProps         type  components/communities/settings/general/AutosaveCommunityKeywords.tsx:23:13
ReleaseCountByYear            type  components/organisation/releases/useSoftwareReleases.tsx:12:13
NewKeyword                    type  components/projects/edit/information/searchForKeyword.ts:14:13
Name                          type  components/software/edit/contributors/FindContributor.tsx:21:13
ContributorInformationConfig  type  components/software/edit/editSoftwareConfig.tsx:167:13
TestimonialInformationConfig  type  components/software/edit/editSoftwareConfig.tsx:241:13
SoftwareInformationConfig     type  components/software/edit/editSoftwareConfig.tsx:85:13

```

### Other knip reports

[Knip](https://knip.dev/) can report more irregularities in the project. Run `npm run knip` to get complete report. However, to validate always run `npm run test` and `npm run build` to confirm that test are working and application can be build.
