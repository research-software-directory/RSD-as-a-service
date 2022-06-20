<!--
SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2021 - 2022 Jason Maassen (Netherlands eScience Center) <j.maassen@esciencecenter.nl>
SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
SPDX-FileCopyrightText: 2021 - 2022 dv4all
SPDX-FileCopyrightText: 2021 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences

SPDX-License-Identifier: CC-BY-4.0
-->

# RSD-as-a-service

![image](https://user-images.githubusercontent.com/4195550/136156498-736f915f-7623-43d2-8678-f30b06563a38.png)

[![DOI](https://zenodo.org/badge/413814951.svg)](https://zenodo.org/badge/latestdoi/413814951)
[![GitHub license](https://img.shields.io/badge/license-Apache--2.0%20-blue.svg)](https://github.com/research-software-directory/RSD-as-a-service/blob/main/LICENSE)
[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8B-orange)](https://fair-software.eu)
![All tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/tests_main.yml/badge.svg)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

## Our mission: To promote the visibility, impact and reuse of research software

This repo contains the new RSD-as-a-service implementation


## Running a local version in 2 steps. 
1. Before installing the dependencies be sure you have ruuning Docker locally. You need to set the environment variables in place:
Copy the file `.env.example` to `.env` file at the root of the project
and fill the secrets in `./frontend/.env.local`. Check if the secrets are correct.
2. Running once `make local` will install all dependencies, build the docker images and run the **data migration** script.


**Requirements:** 
- Docker installed locally
#### List of commands
```shell
make up     # Run the complete solution locally.
make down      # Stop all services with `docker-compose down`
```

### Developing the Frontend
**Requirements:**
- Docker
- NodeJs ^16 or major 

```shell
# Developing the frontend
# One time
make install   # Build and install all dependencies and will run the **data migration** script. 

# Run the Development version 
make dev       # Run the frontend and the documentation locally on localhost:3000 and localhost:3030 respectively
make down      # Stop all services with `docker-compose down`
```

More information about building and data migration can be found in [Getting started](https://research-software-directory.github.io/RSD-as-a-service/getting-started.html) documentation.

## License

The content of this repository is licensed under several licenses. We follow the [REUSE specification](https://reuse.software/) to indicate which license applies to the files specifically. Here are some general hints:

- Source code is licensed under `Apache-2.0`
- Documentation and most images are licensed under `CC BY-4.0`
- Some files with trivial content, e.g. configuration files, are licensed under `CC0-1.0`

For more details on the licenses, please have a look at the file headers or associated `*.license` files. The terms of all used licenses are located in the [LICENSES](./LICENSES/) directory.
