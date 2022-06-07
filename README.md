# RSD-as-a-service

![image](https://user-images.githubusercontent.com/4195550/136156498-736f915f-7623-43d2-8678-f30b06563a38.png)

[![DOI](https://zenodo.org/badge/413814951.svg)](https://zenodo.org/badge/latestdoi/413814951)
[![GitHub license](https://img.shields.io/badge/license-Apache--2.0%20-blue.svg)](https://github.com/research-software-directory/RSD-as-a-service/blob/main/LICENSE)
[![fair-software.eu](https://img.shields.io/badge/fair--software.eu-%E2%97%8F%20%20%E2%97%8F%20%20%E2%97%8B%20%20%E2%97%8F%20%20%E2%97%8B-orange)](https://fair-software.eu)
![All tests](https://github.com/research-software-directory/RSD-as-a-service/actions/workflows/tests_main.yml/badge.svg)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

## Our mission: To promote the visibility, impact and reuse of research software

This repo contains the new RSD-as-a-service implementation


## Running development version locally in 3 steps. 
1. Before installing the dependencies you need to set the environment variables in place:
Copy the file `.env.example` to `.env` file at the root of the project
and fill the secrets in `./frontend/.end.local`. Check if the secrets are correct. 
2. Running once `make install` will install all dependencies, build the docker images and run the **data migration** script.
3. Finally, run `make dev` to start the frontend and documentation servers.


List of commands
```shell
make install   # it will build and install all dependencies and will run the **data migration** script. 
make dev       # it will run the frontend and the documentation locally on localhost:3000 and localhost:3030 respectively
make down      # Stop all services with `docker-compose down`
```

More information about building and data migration can be found in [Getting started](https://research-software-directory.github.io/RSD-as-a-service/getting-started.html) documentation.
