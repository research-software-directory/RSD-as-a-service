# SPDX-FileCopyrightText: 2021 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2021 - 2023 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM postgres:15.3
RUN chmod a+rwx /docker-entrypoint-initdb.d
COPY --chown=postgres:postgres *.sh /docker-entrypoint-initdb.d/
COPY --chown=postgres:postgres *.sql /docker-entrypoint-initdb.d/
