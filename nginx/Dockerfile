# SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
#
# SPDX-License-Identifier: Apache-2.0

FROM nginx:1.21.6
RUN apt-get update && apt-get install --yes certbot python3-certbot-nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
