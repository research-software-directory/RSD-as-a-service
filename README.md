![](https://user-images.githubusercontent.com/4195550/136156498-736f915f-7623-43d2-8678-f30b06563a38.png)

# RSD-as-a-service

## Our mission: To promote the visibility, impact and reuse of research software

This repo contains the new RSD-as-a-service implementation

## Building

The program can easily be built with `docker-compose`. Each service builds the image using specific version (see docker-compose.yml file). Ensure that the version number is increased in the `docker-compose.yml` file when the source code of that service is changed.

Due to technical limutations, the configuration files of the application are in the `frontend` directory. More information about the [frontend setup is avaliable here](frontend/README.md).

1. copy the file `frontend/.env.local.example` to `frontend/.env.local` and `frontend/.env.production.local` and edit/provide the (missing) values
1. run the command `docker-compose build`

## Running locally

Run the command `docker-compose up`. The application can be viewed on http://localhost

## Clear/remove data (reset)

To clear the database, if the database structure has changed or you need to run data migration again, run the command:

```bash
docker-compose down --volumes
```

## Data migration

A data migration script is available to migrate data from the legacy RSD to the new one:

- run current RSD solution using `docker-compose up` from the root of the project
- run the migration script using docker-compose file in the data-migration folder

More information about [data migration is avaliable here](data-migration/README.md).

## Tech Stack

![image](https://user-images.githubusercontent.com/4195550/147217992-0ae7fd21-e775-4b9d-ba5a-b4f50576936f.png)
