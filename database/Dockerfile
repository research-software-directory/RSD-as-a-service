# SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2022 Helmholtz Centre for Environmental Research GmbH - UFZ
#
# SPDX-License-Identifier: Apache-2.0

FROM postgres:14.2
COPY --chown=postgres:postgres *.sql /docker-entrypoint-initdb.d/
