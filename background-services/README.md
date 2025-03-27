<!--
SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2025 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Background services module

This module currently auto-updates the materialized view `count_software_mentions_cached` every five minutes. Look in `.env.example` (search for `background-services`) to see what environment variables need to be set.

## Developing

To run the program locally, remember to load in the env variables and override the value of `POSTGRES_DB_HOST` to `localhost`.

Please respect the current code style (e.g. tabs for indentation) and prevent your IDE/editor to make style changes to existing code. The code is currently formatted using IntelliJ IDEA.

## Future possibilities

This module could be expanded to allow admins to schedule arbitrary database queries, e.g. to auto-clean dangling images and mentions.
