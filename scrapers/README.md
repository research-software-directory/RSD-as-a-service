<!--
SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
SPDX-FileCopyrightText: 2024 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Scrapers

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nl.research-software%3Ascrapers&metric=coverage)](https://sonarcloud.io/summary/overall?id=nl.research-software%3Ascrapers)

This module contains the scrapers used by the RSD. The scrapers are written in Java using Maven.

## Contributing

This module uses [EditorConfig](https://editorconfig.org/) for basic formatting. Please check if your editor [already supports EditorConfig](https://editorconfig.org/#pre-installed) or if you need to [install a plugin](https://editorconfig.org/#download). A GitHub workflow is run on every PR to check if any files violate the formatting settings.

## Running from within Docker Compose

If you have an instance of the RSD, including the scrapers, running with Docker Compose, you can manually run a scraper by running the respective command from the root of the project content:

```shell
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.git.MainProgrammingLanguages
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.git.MainContributors
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.git.MainBasicData
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.git.MainCommits
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.doi.MainMentions
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.doi.MainReleases
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.package_manager.MainPackageManager
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.doi.MainCitations
docker compose exec scrapers java -cp /usr/myjava/scrapers.jar nl.esciencecenter.rsd.scraper.ror.MainRor
```

## Running locally

To run a scraper locally, e.g. from an IDE, you need to make sure the values in `.env` are loaded and that the value for the env variable `POSTGREST_URL` is overwritten with an address that is reachable from outside of the Docker network (usually `http://localhost/api/v1`).
