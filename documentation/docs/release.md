<!--
SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
SPDX-FileCopyrightText: 2022 Netherlands eScience Center

SPDX-License-Identifier: CC-BY-4.0
-->

# Making a release

To make a new release we use github action release_manual.yml to manually release all modules at once.

Follow these steps to call release action.

- navigate to [github actions](https://github.com/research-software-directory/RSD-as-a-service/actions)
- select `create release draft (manual)` action
- on the right you select "Run workflow". Ensure "main" brand is selected and click on "Run workflow"

## Performed operations

- checkout main branch with the complete history
- calculate new version based on conventional commits keywords 'feat/fix'. For breaking changes use BREAKING CHANGE: at the footer of the commit message
- build the services:
  - auth: build, tag and push docker image to ghcr.io
  - database: build, tag and push docker image to ghcr.io
  - backend: build, tag and push docker image to ghcr.io
  - frontend: build, tag and push docker image to ghcr.io
  - nginx: build, tag and push docker image to ghcr.io
  - scrapers: build, tag and push docker image to ghcr.io
- create docker-compose.yml for relase that uses images created in the previous step
- update citation file with new version number and release date
- make deployment.zip file where all files needed for deployment are included
- commit new CITATION.cff file with message 'release: update citation file'
- create github release (draft) and include information from changelog and deployment.zip

## Removing draft release

If you need to remove draft release you can do that via [github interface](https://github.com/research-software-directory/RSD-as-a-service/releases)

## Removing tags

If you need to remove tag from the repository use following commands.

```bash
# delete locally
git tag -d {tag}
# remove from origin
git push origin --delete {tag}
# or more specificaly
git push origin :refs/tags/{tag}
```
