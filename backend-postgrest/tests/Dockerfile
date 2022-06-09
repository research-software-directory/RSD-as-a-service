# SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
# SPDX-FileCopyrightText: 2022 dv4all
#
# SPDX-License-Identifier: Apache-2.0

FROM node:17.7.1-alpine3.14
WORKDIR /usr/app
RUN npm install newman@5.3.2 wait-on@6.0.1
COPY ./RSD-SaaS-auth.postman_collection.json /usr/app
CMD npx wait-on --timeout 10000 $POSTGREST_URL && npx newman run RSD-SaaS-auth.postman_collection.json --global-var "backend_url=$POSTGREST_URL" --global-var "jwt_secret=$PGRST_JWT_SECRET"
