-- SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'POSTGRES_AUTHENTICATOR_PASSWORD';

CREATE ROLE web_anon NOLOGIN;

GRANT USAGE ON SCHEMA public TO web_anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO web_anon;

GRANT web_anon TO authenticator;

CREATE ROLE rsd_admin NOLOGIN;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rsd_admin;

GRANT rsd_admin TO authenticator;

CREATE ROLE rsd_user NOLOGIN;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO rsd_user;

GRANT rsd_user TO authenticator;
