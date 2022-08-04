# SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2021 - 2022 dv4all
#
# SPDX-License-Identifier: Apache-2.0

FROM node:18.5-buster-slim

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

# copy
COPY package.json yarn.lock ./

# install
RUN yarn install --frozen-lockfile --silent

# copy all files from repo (ones not defined in .dockerignore)
COPY . .

# test solution
RUN yarn test

ENV NODE_ENV production

# build the solution
RUN yarn build

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]
