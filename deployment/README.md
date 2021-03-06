<!--
SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2022 dv4all

SPDX-License-Identifier: CC-BY-4.0
-->

# Deployment of RSD

This readme describes RSD deployment with provided docker-compose.yml and .env.example file.

## Requirements

You need machine with the Docker and Docker-Compose. To validate you can check the versions

```bash
# check docker exists
docker --version
# check docker-compose exists
docker-compose --version
```

## Environment variables

RSD modules require a number of environment variables to work properly. The values should be provided in .env file which should be at the same location as the docker-compose.yml file. An example environment file `.env.example` is provided. Rename this file to `.env` and provide required secrets.

## NGINX configuration

The default nginx.conf file is provided. The nginx image is based on nginx:1.21.6 with certbot already installed.
To enable certbox certificate for your domain you will need to add your domains to nginx.conf file. docker-compose file expects nginx.conf file to be in the same folder.

### Start

After you provided required values in .env file and updated domain names in nginx.conf file you can start RSD using `docker-compose up`

```bash
# start solution
docker-compose up
```

### Stop solution

```bash
docker-compose stop
```

### Remove solution

```bash
# remove RSD and volumes
docker-compose down --volumes
```

## Volumes and network

In the provided docker-compose file we defined a volume where the database will store the data.
The internal docker network is also defined.
