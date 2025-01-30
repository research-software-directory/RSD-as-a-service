# SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
# SPDX-FileCopyrightText: 2021 - 2022 dv4all
# SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
# SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

# ----------------------------------------
# 1. Install dependencies only when needed
# ----------------------------------------
FROM node:22.13.1-bookworm-slim AS deps

WORKDIR /app

# copy
COPY package.json package-lock.json ./
# install - we need to use --force to install search dep
# that does not support docusaurus v3 currently
RUN npm install --frozen-lockfile --silent --force

# ----------------------------------------
# 2. Build image
# ----------------------------------------
FROM deps AS builder

WORKDIR /app

# copy node_module from deps image
COPY --from=deps /app/node_modules ./node_modules
# copy all files from repo (ones not defined in .dockerignore)
COPY . .

# build the solution
RUN npm run build

# ----------------------------------------
# 3. Production image (standalone mode)
# ----------------------------------------
FROM nginx:alpine-slim AS runner

# copy content from build folder into nginx html location
COPY --from=builder /app/build /usr/share/nginx/html

# EXPOSE 80
# CMD ["node", "server.js"]