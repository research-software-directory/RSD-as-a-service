# SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM postgres:14.2
COPY --chown=postgres:postgres *.sql /docker-entrypoint-initdb.d/
