# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM node:18.8.0-bullseye-slim
WORKDIR /usr/app
COPY ./package.json /usr/app
RUN npm install
COPY ./main.js /usr/app
CMD npx wait-on --timeout 10000 $POSTGREST_URL && node main.js
