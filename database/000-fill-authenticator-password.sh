# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

echo $POSTGRES_AUTHENTICATOR_PASSWORD
sed --in-place "s/POSTGRES_AUTHENTICATOR_PASSWORD/$(echo $POSTGRES_AUTHENTICATOR_PASSWORD)/1" /docker-entrypoint-initdb.d/001-setup-basic-roles.sql
