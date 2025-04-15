# SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

sed --in-place "s/POSTGRES_AUTHENTICATOR_PASSWORD/$(echo $POSTGRES_AUTHENTICATOR_PASSWORD)/1" /docker-entrypoint-initdb.d/001-setup-basic-roles.sql
sed --in-place "s/_database_name_/$(echo $POSTGRES_DB)/1" /docker-entrypoint-initdb.d/001-setup-basic-roles.sql
