# SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
# SPDX-FileCopyrightText: 2022 - 2023 dv4all
# SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
# SPDX-FileCopyrightText: 2025 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

# ensure same version is used in package.json for local testing
FROM mcr.microsoft.com/playwright:v1.49.1-jammy

# create working dir
WORKDIR /app

# copy package.json first - for caching
COPY package.json package-lock.json ./

# install all dependencies
RUN npm ci

# copy all files
COPY . .

RUN npx playwright install chromium chrome firefox msedge --with-deps

# run e2e:docker script
CMD npm run e2e:docker
