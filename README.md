![](https://user-images.githubusercontent.com/4195550/136156498-736f915f-7623-43d2-8678-f30b06563a38.png)
# RSD-as-a-service

## Our mission: To promote the visibility, impact and reuse of research software

This repo contains the new RSD-as-a-service implementation

## Building

The program can easily be built with `docker-compose`:

1. Run the command `docker-compose build`. You might see an error from the service `data-migration_1`. This is intentional and is used as a workaround to only download dependencies if needed but to not start the program. The whole process itself should end successfully.

## Running locally

Navigate to frontend folder and copy env.local.example file to `env.production.local` and provide missing values.

- `env.local` file is used when running frontend locally with `yarn dev`
- `env.production.local` file is used when running frontend with docker compose `docker-compose up`

More information about the [frontend setup is avaliable here](frontend/README.md).

The program can easily be build with `docker-compose`. To run with the data migration script:

1. Run the command `docker-compose up`. As a lot of data is downloaded and processed, this can take a while (think 15 to 30 seconds).

2. After the service `data-migration_1` has exited with code `0`, you can view the data at various endpoints, e.g. http://localhost:3500/software and http://localhost:3500/project?select=_,output:mention!output_for_project(_),impact:mention!impact_for_project(\*).

To run without the data migration script:

1. Run the command `docker-compose up --scale data-migration=0`.

To run without frontend and data migration in docker-compose:

1. Run the command `docker-compose up --scale frontend=0 --scale data-migration=0`.

A service for automated testing is also included. It is called `test` and can as such be included with its name or excluded with `--scale test=0`. The tests assume that the database is empty at the start and will delete all content from the database as final tests so they cannot be run in conjunction with the `data-migration` service.

To clear the database (if the database structure has changed for example) before repeating the process:

1. Run the command `docker-compose down --volumes`.

## Tech Stack
![image](https://user-images.githubusercontent.com/4195550/147217992-0ae7fd21-e775-4b9d-ba5a-b4f50576936f.png)


