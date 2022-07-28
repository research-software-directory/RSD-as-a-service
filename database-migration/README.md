<!--
SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
SPDX-FileCopyrightText: 2022 dv4all

SPDX-License-Identifier: CC-BY-4.0
-->

# Database migration with MIGRA

We use MIGRA tool to compare two database structure and generate migration sql script. The migration script contains the schema operation that need to be performed in order to make the structure of the current database align with the new version.

MIGRA tool is open source and the [repo is here](https://github.com/djrobstep/migra)
The [documentation website is here](https://databaseci.com/docs/migra/quickstart)

## Steps to generate migration script

The docker-compose file in this directory starts up two database instances and migra.

Provide information in the .env file the versions of RSD database image you want to compare and the filename where you want migra output to be saved. The file is saved in sql folder. The name is specified in env variable MIGRATION_FILE_NAME.

Relevant definitions in .env file

```env
# versions to compare
# image tag current database version
DB_CURRENT_VERSION=v1.1.1
# image tag next/future database version
DB_NEXT_VERSION=v1.2.1
# wait before starting analyses (database containers need to initialize before analyses van be performed)
MIGRA_SLEEP_TIME=20
# save to this filename in the folder sql
MIGRATION_FILE_NAME=migration-example
```

Start with `docker-compose up`

## Conclusion

I was able to create migration-v111-to-v121.sql file using migra but after testing it locally there was an error at line 331, `with check true;` should be `with check (true);`. The second true was not enclosed in the paranthesis. The tool is quite useful but testing and some manual intervention are needed.
