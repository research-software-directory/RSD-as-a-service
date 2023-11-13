# Database structure

![database diagram](img/database-scheme.webp)

The SQL scripts used to [create tables, relations, RLS and RPC's are in the database folder of our repo](https://github.com/research-software-directory/RSD-as-a-service/tree/main/database).

## Database migration scripts

We [publish database migration script during the release](https://github.com/research-software-directory/RSD-as-a-service/releases). The migration script can be used to upgrade the database structure from the previous version to released version. We use the published database migration script to update out production RSD instance.

All [migration scripts are stored in our production repository](https://github.com/research-software-directory/RSD-production/tree/main/database-migration).
