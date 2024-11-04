# SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM denoland/deno:2.0.4
WORKDIR /usr/app
COPY ./package.json /usr/app
RUN deno install
COPY ./img /usr/app/img
COPY ./images.js /usr/app
COPY ./real-data.js /usr/app
COPY ./main.js /usr/app
CMD deno run -A npm:wait-on --timeout 10000 $POSTGREST_URL && deno run --allow-env=POSTGREST_URL,PGRST_JWT_SECRET --allow-read=./ --allow-net=backend:3500 main.js
