# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

FROM djrobstep/migra:3.0.1621480950

CMD sleep 10 && migra --unsafe postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@database:5432/${POSTGRES_DB} postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@migration-database:5432/${POSTGRES_DB} > migration.sql
