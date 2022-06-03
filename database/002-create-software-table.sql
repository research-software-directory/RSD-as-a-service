-- SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TYPE description_type AS ENUM (
	'link',
	'markdown'
);

CREATE TABLE software (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(100) UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	brand_name VARCHAR(100) NOT NULL,
	concept_doi VARCHAR,
	description VARCHAR,
	description_url VARCHAR(200),
	description_type description_type DEFAULT 'markdown' NOT NULL,
	get_started_url VARCHAR,
	is_featured BOOLEAN DEFAULT FALSE NOT NULL,
	is_published BOOLEAN DEFAULT FALSE NOT NULL,
	short_statement VARCHAR(300),
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
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
	NEW.slug = OLD.slug;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software BEFORE UPDATE ON software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software();
