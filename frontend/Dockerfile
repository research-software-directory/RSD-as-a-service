# SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2021 - 2022 dv4all
# SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
# SPDX-FileCopyrightText: 2023 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

# Based on Next official example for minimal image size (standalone approach)
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# it requires output: 'standalone' in next.config.js

# ----------------------------------------
# 1. Install dependencies only when needed
# ----------------------------------------
FROM node:20.10-slim AS deps

WORKDIR /app

# copy
COPY package.json yarn.lock ./
# install
RUN yarn install --frozen-lockfile --silent

# ----------------------------------------
# 2. Build image
# ----------------------------------------
FROM deps AS builder

WORKDIR /app

# copy node_module from deps image
COPY --from=deps /app/node_modules ./node_modules
# copy all files from repo (ones not defined in .dockerignore)
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# unit tests are already runned on PR and push to main
# RUN yarn test

# build the solution
RUN yarn build

# ----------------------------------------
# 3. Production image (standalone mode)
# ----------------------------------------
FROM node:20.10-slim AS runner

# optional install updates
# RUN apt-get upgrade -y

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Using standalone output to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# required to enable fetch to localhost:3000
# set next port
ENV PORT 3000
# set next hostname
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]