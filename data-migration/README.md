# Data migration

This directory contains a `java` program that migrates data from the existing RSD to the new RSD. It is currently under construction. After the data has been migrated and the new RSD is in production, this script will be deprecated.

## Build solution

```bash
docker-compose build
```

You might see an error from the service `data-migration_1`. This is intentional and is used as a workaround to only download dependencies if needed but to not start the program. The whole process itself should end successfully.

## Run solution

```bash
# ensure main RSD application is started
# cd ../ & docker-compose up
# run data-migation && clean up on exit 0
docker-compose up --abort-on-container-exit \
  && docker-compose down
```

## Possible errors

When running data migration script multiple times the script might fail with the `duplicate key violation` error. The script migrates all data in one go. If the script fails in the middle of the migration you will need to remove all data from the database prior to runnin the script again.

```bash
data-migration    | [ERROR] Failed to execute goal org.codehaus.mojo:exec-maven-plugin:3.0.0:java (default-cli) on project data-migration: An exception occured while executing the Java class. Error fetching data from the endpoint: {"hint":null,"details":null,"code":"23505","message":"duplicate key value violates unique constraint \"software_slug_key\""} -> [Help 1]

...

data-migration exited with code 1
```

The easiest way to remove data is to stop main docker-compose session and remove data volumes: `docker-compose down --volumes`. Then start main app docker compose and data migration docker compose.

```bash
# back to root folder
cd ..
# stop main app and remove database volume
docker-compose down --volumes
# start app again (postgres serverice will create all tables & views)
docker-compose up
# move to data-migration
cd data-migration
# run data migration docker-compose
docker-compose up
```

The succefull data migration log should be similair to one bellow

```bash
data-migration    | [INFO] Scanning for projects...
data-migration    | [INFO]
data-migration    | [INFO] ----------------< nl.research-software:data-migration >-----------------
data-migration    | [INFO] Building data-migration 1.0-SNAPSHOT
data-migration    | [INFO] --------------------------------[ jar ]---------------------------------
data-migration    | [INFO]
data-migration    | [INFO] --- exec-maven-plugin:3.0.0:java (default-cli) @ data-migration ---
data-migration    | [INFO] ------------------------------------------------------------------------
data-migration    | [INFO] BUILD SUCCESS
data-migration    | [INFO] ------------------------------------------------------------------------
data-migration    | [INFO] Total time:  7.317 s
data-migration    | [INFO] Finished at: 2022-01-03T09:33:54Z
data-migration    | [INFO] ------------------------------------------------------------------------
data-migration exited with code 0
```
