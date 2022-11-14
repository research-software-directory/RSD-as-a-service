<!--
SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Getting Started

## Dependencies

To run the application locally you need to install the following dependencies:

*   Docker

## Get Started

### Monorepo

The RSD-as-a-Service project is a divided into different services included in the mono repo:

|-- authentication  
|-- backend-postgrest  
|-- data-migration  
|-- database  
|-- deployment  
|-- documentation  
|-- frontend  
|-- nginx  
|-- scrapers

### Environment variables

The environment variables should be stored in a .env file, which is automatically loaded by docker-compose. To validate loading of env variables use `docker-compose config`. More info about the use of environment variables in docker-compose is available at [official documentation](https://docs.docker.com/compose/environment-variables/)

*   copy the file `.env.example` to `.env` file at the root of the project

```bash
# from project root dir
cp .env.example .env
```

*   You need to modify the new .env file with the corresponding value secrets.
*   build local images

```bash
# from project root dir
docker-compose build
```

## Running locally

Run the command `docker-compose up`.

```bash
# from project root dir
docker-compose up
```

The application can be viewed at http://localhost

### Logging in with admin rights

The default role assigned to a logged in user is `rsd_user`. To obtain the `rsd_admin` role, you need to update the `RSD_ADMIN_EMAIL_LIST` variable in `.env`.

#### Local accounts

::: danger
Local accounts should only be used in development mode.
:::

If you activated local login by adding `LOCAL` to `RSD_AUTH_PROVIDERS`, admin rights can be obtained by adding `<name>@example.com` to `RSD_ADMIN_EMAIL_LIST`, where `<names>` is the name entered when logging in. Here is an example:

```bash
RSD_AUTH_PROVIDERS=LOCAL
RSD_ADMIN_EMAIL_LIST=admin@example.com
```

If you now login as the user `admin`, you will be assigned the role `rsd_admin`.

#### Other IDPs

If you are using other IDPs, make sure to add the mail address that is being provided by the IDP. If you are using the SURFconext development instance, have a look at [this list](https://idp.diy.surfconext.nl/showusers.php) to obtain the email addresses that are provided for the test accounts.

### Frontend with hot-module-replacement (HMR)

To run the frontend in the development mode with the hot-module-replacement (HMR) you should start an additional instance of the frontend which will be available at http://localhost:3000

```bash
# navigate to frontend folder
cd frontend
# install dependencies
yarn install
# start fe in dev mode
yarn dev
```

More information about the frontend setup is [available in the frontend readme file](/frontend/README.md).

### Documentation site

The documentation site runs on GitHub Pages. Any changes inside this folder will trigger a GitHub action to deploy the changes automatically when merging a Pull Request to the main branch.

To run locally the documentation site, you need `nodejs` installed on your machine.

```bash
# navigate to frontend folder
cd documentation
# install dependencies
yarn install
# start fe in dev mode
yarn dev
```

All documentation files written in Markdown are placed inside the `./documentation/docs/` folder.

You can edit the `navigation bar` and the `sidebar` from the `./doumentation/docs/.vuepress/config.js` file.

Any file `markdown file` added indie the `docs` folder will be available on built time.

## Clear/remove data (reset)

To clear the database, if the database structure has changed or you need to run data migration again, run the command:

```bash
docker-compose down --volumes
```

## Tech Stack

![image](/rsd-stack-220304.png)
