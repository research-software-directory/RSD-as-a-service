# SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
# SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
#
# SPDX-License-Identifier: Apache-2.0

FROM node:22.13.1-bookworm-slim
WORKDIR /usr/app
COPY ./package.json /usr/app
RUN npm install
COPY ./img /usr/app/img
COPY ./images.js /usr/app
COPY ./real-data.js /usr/app
COPY ./main.js /usr/app
CMD npx wait-on --timeout 10000 $POSTGREST_URL && node main.js
