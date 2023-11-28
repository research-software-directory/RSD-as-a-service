# Database

This section contains various topics on the RSD database.

## Database structure

![database diagram](img/database-scheme.webp)

The SQL scripts used to [create tables, relations, RLS and RPC's are in the database folder of our repo](https://github.com/research-software-directory/RSD-as-a-service/tree/main/database).

## Connecting to the database

In some cases, it can be useful to connect to the database directly, so you can query it.
To do so, first connect to the VM on which your RSD instance lives and go to the directory containing the `docker-compose.yml` file.
Then run the command

```shell
docker compose exec database bash
```

to enter the database Docker container.
Then run

```shell
psql --dbname=rsd-db --username=rsd
```

where you should replace the values if you set them differently in your `.env`.
You can now run arbitrary SQL queries as root user.

## Database migration scripts

We [publish database migration script during the release](https://github.com/research-software-directory/RSD-as-a-service/releases). The migration script can be used to upgrade the database structure from the previous version to released version. We use the published database migration script to update out production RSD instance.

All [migration scripts are stored in our production repository](https://github.com/research-software-directory/RSD-production/tree/main/database-migration).
