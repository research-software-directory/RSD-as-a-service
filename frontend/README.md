# Research Software Directory (RSD) - Frontend

Based on the features in the legacy application and the current requirements we selected [NextJS](https://nextjs.org/docs) and MUI-5 (https://mui.com/getting-started/usage/) frameworks for:

- Easy integration with generic SSO oAuth services like ORCID, SURFconext, Microsoft etc.
- SEO support for custom meta tags and dynamic build sitemap.xml file
- Rapid development of user interface, in particular, the input/admin pages of the legacy application require improvements

## Development

- intall dependencies `npm install`
- create env.local file. Use env.local.example as template.
- run `npm run dev` or `yarn dev` to start application in development mode

### Environment variables

For oAuth implementation we need number of env variables. Copy env.local.example file to `env.local` and provide values required for next-auth module.

**Note! docker-compose uses this env file to load variables in the docker image.**

## Docker compose

Use `docker-compose up` to run solution in Docker container. The solution is avaliable at http://localhost:3000
To rebuild the image run `docker-compose up --build`.

The image version is defined in docker-compose.yml file. When you inrease version number in the docker-compose.yml file new build will triggered even if you run `docker-compose up` without build flag. Please keep the version numbers in `package.json` and in `docker-compose.yml` the same. At this point this requires manual change at both file, later we should look for the ways to automate it in the CI/CD pipelines.

## Folders

- `components`: all custom components created in this project are stored in this folder.
- `config`: place for configuration objects used in the application. For example, menu items are stored here.
- `pages`: next specific pages and api endpoints folders. For more information [see official documentation](https://nextjs.org/docs/routing/introduction)
- `public`: folder for public assets of the website. For example favicon.ico file and robots.txt are stored here. The root of the public folder is equivalent to root on the webserver. Note that react file at `page/index.tsx` represents the template for the root webpage.
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

## Authentication

For authentication we use `next-auth`. For more information see [official documentation](https://next-auth.js.org/getting-started/example).

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
