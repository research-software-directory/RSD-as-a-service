-- SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

-- install citext extension for
-- case insensitive indexing
-- https://www.postgresql.org/docs/current/citext.html
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TYPE description_type AS ENUM (
	'link',
	'markdown'
);

CREATE TABLE software (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(200) UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	brand_name VARCHAR(200) NOT NULL,
	concept_doi CITEXT CHECK (concept_doi ~ '^10(\.\w+)+/\S+$' AND LENGTH(concept_doi) <= 255),
	description VARCHAR(10000),
	description_url VARCHAR(200) CHECK (description_url ~ '^https?://'),
	description_type description_type DEFAULT 'markdown' NOT NULL,
	get_started_url VARCHAR(200) CHECK (get_started_url ~ '^https?://'),
	is_published BOOLEAN DEFAULT FALSE NOT NULL,
	short_statement VARCHAR(300),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_software BEFORE INSERT ON software FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_software();


CREATE FUNCTION sanitise_update_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;

	IF NEW.slug IS DISTINCT FROM OLD.slug AND CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the slug';
	END IF;

	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software BEFORE UPDATE ON software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software();
