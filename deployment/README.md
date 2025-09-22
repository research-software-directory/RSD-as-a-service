<!--
SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2022 dv4all
SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences

SPDX-License-Identifier: CC-BY-4.0
-->

# Deployment of RSD

This readme describes RSD deployment with provided `docker-compose.yml` and `.env.example` file.

## Requirements

You need a machine with Docker and the Docker Compose CLI plugin. To validate you can check the versions

```bash
# check docker exists
docker --version
# check docker compose exists
docker compose --version
```

## Environment variables

RSD modules require a number of environment variables to work properly. The values should be provided in `.env` file which should be at the same location as the `docker-compose.yml` file. An example environment file `.env.example` is provided. Rename this file to `.env` and provide the required secrets.

## NGINX configuration

The default `nginx.conf` file is provided. The nginx image is based on nginx:1.21.6 with certbot already installed.
To enable certbox certificate for your domain you will need to add your domains to `nginx.conf file`. The `docker-compose.yml` file expects `nginx.conf` file to be in the same folder.

## Custom theme

RSD supports custom theming. It is achieved by mounting font definitions as index.css file and settings.json file.
The default index.css and settings.json are already in the frontend image. If you want to overwrite these settings you will need to mount your custom definitions into frontend image. Alter docker-compose frontend service with volume like in the example

```yaml
  # frontend definitions example to mount custom theme
  # add volumes as in this example to load index.css and settings.json
  frontend:
    container_name: frontend
    build:
      context: ./frontend
      # dockerfile to use for build
      dockerfile: Dockerfile
    # update version number to corespond to frontend/package.json
    image: rsd/frontend:1.3.0
    environment:
      # it uses values from .env file
      - POSTGREST_URL
      - PGRST_JWT_SECRET
      - RSD_AUTH_URL
      - RSD_AUTH_PROVIDERS
      - MATOMO_URL
      - MATOMO_ID
      - SURFCONEXT_CLIENT_ID
      - SURFCONEXT_WELL_KNOWN_URL
      - HELMHOLTZID_CLIENT_ID
      - HELMHOLTZID_WELL_KNOWN_URL
      - HELMHOLTZID_SCOPES
    expose:
      - 3000
    depends_on:
      - database
      - backend
      - auth
    volumes:
      # mount local styles folder into styles folder of frontend app (index.css file is the access point)
      - ./deployment/rsd/styles:/app/public/styles
      # mount custom settings (theme colors and typography definitions) into data folder of frontend app
      - ./deployment/rsd/data:/app/public/data
      # mount custom images used on custom home page (for helmholtz only)
      - ./deployment/rsd/images:/app/public/images
    networks:
      - net
```

### Start

After you provided required values in .env file and updated domain names in nginx.conf file you can start RSD using `docker compose up`

```bash
# start RSD
docker compose up
```

### Stop RSD

```bash
docker compose stop
```

### Remove solution

```bash
# remove RSD and volumes
docker compose down --volumes
```

## Volumes and network

In the provided `docker-compose.yml` file we define a volume where the database will store the data.
The internal docker network is also defined.

You can use volume mount in the frontend image to provide custom settings that will overwrite default theme and styles.
