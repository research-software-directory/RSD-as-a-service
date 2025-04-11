-- SPDX-FileCopyrightText: 2021 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

ALTER DATABASE "_database_name_" SET JIT = OFF;

CREATE ROLE rsd_authenticator NOINHERIT LOGIN PASSWORD 'POSTGRES_AUTHENTICATOR_PASSWORD';

CREATE ROLE rsd_web_anon NOLOGIN;

GRANT USAGE ON SCHEMA public TO rsd_web_anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO rsd_web_anon;

GRANT rsd_web_anon TO rsd_authenticator;

CREATE ROLE rsd_admin NOLOGIN;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rsd_admin;

GRANT rsd_admin TO rsd_authenticator;

CREATE ROLE rsd_user NOLOGIN;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rsd_user;

GRANT rsd_user TO rsd_authenticator;
