# Research Software Directory (RSD) - Frontend

Based on the features in the legacy application and the current requirements we selected [NextJS](https://nextjs.org/docs) and MUI-5 (https://mui.com/getting-started/usage/) frameworks for:

- Easy integration with generic SSO oAuth services like ORCID, SURFconext, Microsoft etc.
- SEO support for custom meta tags and dynamic build sitemap.xml file
- Rapid development of user interface, in particular, the input/admin pages of the legacy application require improvements

## Development

- intall dependencies `yarn install`
- create env.local and env.production.local file. Use env.local.example as template.
- run all app modules `docker-compose up`
- open another terminal and run `yarn dev` to start application in development mode

### Environment variables

For oAuth implementation we need env variables. Copy env.local.example file to `env.local` and provide values required for next-auth module. In addition we use few public env variables that exposed to the browser. These values are stored in .env file. See [next documentation page for more info](https://nextjs.org/docs/basic-features/environment-variables).

- `env` file contains public env variables. If different values are required for production create env.production file
- `env.development` development specific values, when running frontend using `yarn dev`.
- `env.local` contains secrets when running frontend in local development (yarn dev). This file is not in the repo. You will need to create it and add secrets to it.
- `env.local.example` this is example file. copy to env.local for local development and env.production.local
- `env.production.local` file is used when running frontend with docker compose `docker-compose up`.

## Docker compose frontend only

Use `docker-compose up` to run solution in Docker container. The solution is avaliable at http://localhost:3000
To rebuild the image run `docker-compose up --build`.

The image version is defined in docker-compose.yml file. When you inrease version number in the docker-compose.yml file new build will triggered even if you run `docker-compose up` without build flag. Please keep the version numbers in `package.json` and in `docker-compose.yml` the same. At this point this requires manual change at both file, later we should look for the ways to automate it in the CI/CD pipelines.

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

For authentication we use `next-auth`. For more information see [official documentation](https://next-auth.js.org/getting-started/example).

## Unit testing

For unit testing we use [react testing library](https://testing-library.com/docs/react-testing-library/intro/).
There are several practices that the React Testing Library promotes:

- Avoid testing internal component state
- Testing how a component renders

The setup is performed according to [official Next documentation](https://nextjs.org/docs/testing#jest-and-react-testing-library)

### Setup steps performed

```bash
# install dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom react-test-renderer
# install jest-fetch-mock support fetch in Jest (node environment not browser)
# and whatwg-fetch to address next-auth fetch requests on node js (node-fetch)
npm i -D jest-fetch-mock whatwg-fetch

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

### Fetch mock

I tried to use fetch mock. More [info about setup here](https://frontend-digest.com/testing-getserversideprops-in-nextjs-b339ebcf3401).

**The fetch mock library does not integrate well with next-auth. When enabled it causes error in session provider of next-auth. Further investigation is required.**

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
