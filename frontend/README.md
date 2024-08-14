<!--
SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2021 - 2023 dv4all
SPDX-FileCopyrightText: 2022 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2022 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)

SPDX-License-Identifier: CC-BY-4.0
-->

# Research Software Directory (RSD) - Frontend

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rsd-frontend&metric=coverage)](https://sonarcloud.io/summary/overall?id=rsd-frontend)

Based on the features in the legacy application and the current requirements we selected [Next.js](https://nextjs.org/docs) and MUI-5 (https://mui.com/getting-started/usage/) frameworks for:

- Easy integration with generic SSO oAuth services like ORCID, SURFconext, Microsoft etc.
- SEO support for custom meta tags and dynamic build sitemap.xml file
- Rapid development of user interface, in particular, the input/admin pages of the legacy application require improvements

## Development

### Locally running frontend in dev mode

- install dependencies `yarn install`
- create `.env.local` file. Use `.env.example` from the project root as template.
- run all app modules `docker compose up`
- open another terminal and run `yarn dev` to start frontend in development mode

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

- `.env.local` contains secrets when running frontend in local development (yarn dev). This file is not in the repo. You will need to create it and add secrets to it. There is one difference from basic .env file.

```env
# postgREST api
# cosumed by services: authentication,frontend,auth-tests
# .env.local: http://localhost/api/v1, .env.production.local: http://backend:3500
POSTGREST_URL=http://localhost/api/v1
```

### Intercepting HTTP requests

It can be useful to intercept HTTP requests made by the Next.js server in order to identify potential bottlenecks and to see if the requests made are correct. In order to do so, add the following snippet to the end of `frontend/pages/_app.tsx`:

```javascript
function replaceFetch(originalFetch: any) {
	const newFetch = async function(url: any, conf: any) {
		const tik = Date.now();
		const resp = await originalFetch(url, conf);
		const tok = Date.now();
		console.log(`${tok - tik} ms for URL: ${url}`);
		return resp;
	}

	global.fetch = newFetch;
}

// @ts-ignore
if (!global.originalFetch) {
	const originalFetch = global.fetch;
	// @ts-ignore
	global.originalFetch = originalFetch;

	replaceFetch(originalFetch);
}

// because Next.js overwrites global.fetch again...
setInterval(() => {
	// @ts-ignore
	const originalFetch = global.originalFetch;

	replaceFetch(originalFetch);
}, 10);
```

It will print each HTTP request and the time it took to complete.

## Folders

- `__tests__`: unit test for **pages only**. Unit tests for the components are in the same directory as components.
- `assets`: images and icons. These are imported into the components. In case of SVG images, the content is used to create an icon component.
- `components`: all custom components created in this project are stored in this folder.
- `config`: place for configuration objects. For example, menu items are stored here.
- `pages`: next specific, pages and api endpoints. For more information [see official documentation](https://nextjs.org/docs/routing/introduction)
- `public`: folder for public assets of the website. For example favicon.ico file and robots.txt are stored here. The root of the public folder is equivalent to the root on the webserver. Note that react file at `page/index.tsx` represents the template for the root webpage.
- `styles`: folder for css files and MUI theme objects. Read specific [readme file about theming](./styles/README.md).
- `types`: folder for typescript type objects. Note! specific, not-shared types are sometimes stored within component file
- `utils`: folder for utility functions, hooks, composables etc.

## Material UI (v5)

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
npm i -D tailwindcss@latest postcss@latest autoprefixer@latest
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

- `yarn test:watch`: to run test in watch mode. The tests will run on each change in the test/component file(s)
- `yarn test:coverage`: to run tests and show the test coverage report. This script is used in GH action.
- `yarn test:memlimit`: for minimal memory consumption. When basic test scripts **yarn test** and **yarn test:coverage** causing the memory overflow on your machine use this script to limit the number of concurrent workers and memory usage.
- `yarn test:memory`: for examining memory usage during the tests. In node version 18 (and 16) some changes are made in V8 engine memory management that cause the memory leaks when running tests with Jest. See [issue](https://github.com/facebook/jest/issues/11956)

### Setup steps performed

```bash
# install dependencies
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
# install whatwg-fetch to address next-auth fetch requests on node js (node-fetch)
yarn add -D whatwg-fetch

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

## Updates and upgrades

Upgrading minor version changes can be usually done using `yarn outdated` and `yarn upgrade`. Major updates are more demanding and might require changes in the source code.

Since RSD went live in August 2022 we started using exact versions in the package.json to avoid unexpected upgrades. This means that we manually check for outdated packages and perform "controlled" upgrades. At the same time we run security audits using `yarn audit`.

### Next and React

```bash
# upgrade next, react and typescript
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest typescript
# upgrade types
yarn add -D @types/node @types/react @types/react-dom
```

### Material UI

```bash
# upgrade material ui
yarn add @mui/material @mui/icons-material @emotion/react @emotion/server @emotion/styled
```

### Testing

```bash
# react testing lib
yarn add -D @testing-library/react@latest @testing-library/jest-dom@latest jest@latest jest-environment-jsdom@latest @types/jest@latest
```

### Others

```bash
# cookie for tokens
yarn add cookie
# type
yarn add -D @types/cookie
```

## Maintenance

For the maintenance we use [unimported](https://github.com/smeijer/unimported#readme). It will show a list of unused files and dependencies. Additional exclude definitions, specific to this project, are in `unimportedrc.json`. Unimported is able to identify next and use pages folder as entry points.

```bash
# execute in the frontend folder
yarn unimported
```

- Removing unused files:
Based on report validate that file are unused/not needed. To validate always run `yarn test` and `yarn build` to confirm that test are working and application can be build

- Example report

```bash
RSD-as-a-service/frontend$ npx unimported

       summary               unimported v1.29.2 (next)
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       entry file 1        : ./pages/_app.tsx
       entry file 2        : ./pages/_document.tsx
       entry file 3        : ./pages/admin/keywords.tsx
       entry file 4        : ./pages/admin/orcid-users.tsx
       entry file 5        : ./pages/admin/organisations.tsx
       entry file 6        : ./pages/admin/public-pages.tsx
       entry file 7        : ./pages/admin/rsd-contributors.tsx
       entry file 8        : ./pages/admin/rsd-users.tsx
       entry file 9        : ./pages/admin/software-highlights.tsx
       entry file 10       : ./pages/api/fe/auth/helmholtzid.ts
       entry file 11       : ./pages/api/fe/auth/index.ts
       entry file 12       : ./pages/api/fe/auth/local.ts
       entry file 13       : ./pages/api/fe/auth/orcid.ts
       entry file 14       : ./pages/api/fe/auth/surfconext.ts
       entry file 15       : ./pages/api/fe/cite/index.ts
       entry file 16       : ./pages/api/fe/index.ts
       entry file 17       : ./pages/api/fe/mention/impact.ts
       entry file 18       : ./pages/api/fe/mention/output.ts
       entry file 19       : ./pages/api/fe/mention/software.ts
       entry file 20       : ./pages/api/fe/token/refresh.ts
       entry file 21       : ./pages/cookies.tsx
       entry file 22       : ./pages/index.tsx
       entry file 23       : ./pages/invite/organisation/[id].tsx
       entry file 24       : ./pages/invite/project/[id].tsx
       entry file 25       : ./pages/invite/software/[id].tsx
       entry file 26       : ./pages/login/failed.tsx
       entry file 27       : ./pages/login/local.tsx
       entry file 28       : ./pages/logout.tsx
       entry file 29       : ./pages/organisations/[...slug].tsx
       entry file 30       : ./pages/organisations/index.tsx
       entry file 31       : ./pages/page/[slug].tsx
       entry file 32       : ./pages/projects/[slug]/edit/[page].tsx
       entry file 33       : ./pages/projects/[slug]/edit/index.tsx
       entry file 34       : ./pages/projects/[slug]/index.tsx
       entry file 35       : ./pages/projects/add.tsx
       entry file 36       : ./pages/projects/index.tsx
       entry file 37       : ./pages/robots.txt.tsx
       entry file 38       : ./pages/sitemap/organisations.xml.tsx
       entry file 39       : ./pages/sitemap/projects.xml.tsx
       entry file 40       : ./pages/sitemap/software.xml.tsx
       entry file 41       : ./pages/software/[slug]/edit/[page].tsx
       entry file 42       : ./pages/software/[slug]/edit/index.tsx
       entry file 43       : ./pages/software/[slug]/index.tsx
       entry file 44       : ./pages/software/add.tsx
       entry file 45       : ./pages/software/index.tsx
       entry file 46       : ./pages/user/[section].tsx

       unresolved imports  : 0
       unused dependencies : 0
       unimported files    : 5


─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────
     │ 5 unimported files
─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1 │ components/admin/organisations/OrganisationsPage.tsx
   2 │ components/projects/edit/editProjectSteps.tsx
   3 │ utils/nextRouterWithLink.ts
   4 │ utils/useMentionsForSoftware.tsx
   5 │ utils/useOrganisationSoftware.tsx
─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────
```
