# SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM nginx:1.26.1
RUN apt-get update && apt-get install --yes certbot python3-certbot-nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
