# SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2022 dv4all
#
# SPDX-License-Identifier: Apache-2.0

FROM mcr.microsoft.com/playwright:v1.28.0-focal

# create working dir
WORKDIR /app

# copy package.json first - for chaching
COPY package.json package-lock.json ./

# install all dependencies
RUN npm ci

# copy all files
COPY . .

# install browsers?!? do I need this
# RUN npx playwright install

# sleep for 10 sec and then run e2e:all script
CMD npm run e2e:all
