<!--
SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2021 - 2023 dv4all
SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences

SPDX-License-Identifier: CC-BY-4.0
-->

# Research Software Directory (RSD) - Frontend

Based on the features in the legacy application and the current requirements we selected [NextJS](https://nextjs.org/docs) and MUI-5 (https://mui.com/getting-started/usage/) frameworks for:

- Easy integration with generic SSO oAuth services like ORCID, SURFconext, Microsoft etc.
- SEO support for custom meta tags and dynamic build sitemap.xml file
- Rapid development of user interface, in particular, the input/admin pages of the legacy application require improvements

## Development

### Locally running frontend in dev mode

- intall dependencies `yarn install`
- create `.env.local` file. Use `.env.example` from the project root as template.
- run all app modules `docker-compose up`
- open another terminal and run `yarn dev` to start frontend in development mode

### Frontend dev mode via Docker

**Use this if you are using a custom theme and mount files from the `/deployment` directory**

You can start the frontend in dev mode inside Docker using the `Makefile`. The command will make sure that the created Docker container uses a user with the same user id and group id as your local account. This ensures that you will be the owner of all files that are written via mounted volumes to your drive (mainly everything in the `frontend/.next` and `frontend/node_modules` folders).

```bash
make frontend-docker
```

Alternatively you can run

```bash
# Export your user and group ids to the variables so Docker will correctly build the frontend-dev container. This is required only if you build the container
export DUID=$(id -u)
export DGID=$(id -g)
docker-compose build frontend-dev
docker-compose up --scale frontend=0 --scale frontend-dev=1 --scale scrapers=0
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

## Folders

- `__tests__`: unit test for **pages only**. Unit tests for the components are in the same directory as components.
- `assets`: images and icons. These are imported into the components. In case of svg's the content is used to create an icon coponent.
- `components`: all custom components created in this project are stored in this folder.
- `config`: place for configuration objects. For example, menu items are stored here.
- `pages`: next specific, pages and api endpoints. For more information [see official documentation](https://nextjs.org/docs/routing/introduction)
- `public`: folder for public assets of the website. For example favicon.ico file and robots.txt are stored here. The root of the public folder is equivalent to the root on the webserver. Note that react file at `page/index.tsx` represents the template for the root webpage.
- `styles`: folder for css files and MUI theme objects. Read specific [readme file about theming](./styles/README.md).
- `types`: folder for typescript type objects. Note! specific, not-shared types are sometimes stored within component file
- `utils`: folder for utility functions, hooks, composables etc.

## Material UI (v5)

The integration between NextJS and MUI-5 is based on [official example](https://github.com/mui-org/material-ui/tree/master/examples/nextjs).
More explation concerning the official example can be found in [this video](https://www.youtube.com/watch?v=IFaFFmPYyMI&t=597s)

Most important point concerning Next is integration in template files: \_app.tsx, \_document.tsx

### Theming

Customization in MUI5 is done using [theme object](https://mui.com/customization/theming/).
The theme is provided at the root React component using Theme context provider.
In short, add theme provider to \_app.tsx file

## Tailwind CSS

In addition to MUI-5 team preffers to use Tailwind CSS for global application layout.

```bash
# install dev dependencies
npm i -D tailwindcss@latest postcss@latest autoprefixer@latest
```

Steps performed:

- extracted MUI-5 theme into separate object
- created tailwind.config.js and defined to use shared theme definitions
- created postcss.config.js and added tailwind to it
- added @tailwind mixins to styles/global.css
- created styles/tailwind.css for tailwind specific utilities (eg. @apply)

### Intergration between Tailwind and MUI-5 themes

The integration is based on [this article](https://medium.com/@akarX23/a-full-setup-of-next-js-with-redux-tailwind-material-ui-pwa-and-docker-c33bdceadce5).

## Authentication

For authentication we use custom module which integrates with our auth service. The frontend code is in `frontend/auth` folder and the auth service is in `authentication` folder.

## Unit testing

For unit testing we use [jest](https://jestjs.io/docs/getting-started) and [react testing library](https://testing-library.com/docs/react-testing-library/intro/).
There are several practices that the React Testing Library promotes:

- Avoid testing internal component state
- Testing how a component renders

The setup is performed according to [official Next documentation](https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler). We use rust compiler instead of babel setup.

### Unit testing scripts

- `yarn test:watch`: to run test in watch mode. The tests will be runned on each change in the test/component file(s)
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

## NextJS

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Major version updates

Upgrading minor version changes can be usally done using `yarn outdated` and `yarn upgrade`. Major updates are more demanding and might require changes in the source code.

Since RSD went live in August 2022 we started using exact versions in the package.json to avoid unexpected upgrades. This means that we manually check for outdated packages and perform "controlled" upgrades. At the same time we perfom security audits using `yarn audit`.

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
yarn add -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom @types/jest
```

### Others

```bash
# cookie for tokens
yarn add cookie
# type
yarn add -D @types/cookie
```
