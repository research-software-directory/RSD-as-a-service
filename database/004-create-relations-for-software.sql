-- SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TYPE platform_type AS ENUM (
	'github',
	'gitlab',
	'bitbucket',
	'other'
);

CREATE TABLE repository_url (
	software UUID references software (id) PRIMARY KEY,
	url VARCHAR(200) NOT NULL CHECK (url ~ '^https?://'),
	code_platform platform_type NOT NULL DEFAULT 'other',
	languages JSONB,
	languages_scraped_at TIMESTAMPTZ,
	license VARCHAR(200),
	license_scraped_at TIMESTAMPTZ,
	commit_history JSONB,
	commit_history_scraped_at TIMESTAMPTZ
);



CREATE TABLE license_for_software (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID references software (id) NOT NULL,
	license VARCHAR(100) NOT NULL,
	UNIQUE(software, license),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_license_for_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_license_for_software BEFORE INSERT ON license_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_license_for_software();


CREATE FUNCTION sanitise_update_license_for_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_license_for_software BEFORE UPDATE ON license_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_license_for_software();



CREATE TABLE contributor (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID references software (id) NOT NULL,
	is_contact_person BOOLEAN NOT NULL DEFAULT FALSE,
	email_address VARCHAR(200),
	family_names VARCHAR(200) NOT NULL,
	given_names VARCHAR(200) NOT NULL,
	affiliation VARCHAR(200),
	role VARCHAR(200),
	orcid VARCHAR(19) CHECK (orcid ~ '^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$'),
	position INTEGER,
	avatar_id VARCHAR(40) REFERENCES image(id),	
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_contributor() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_contributor BEFORE INSERT ON contributor FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_contributor();


CREATE FUNCTION sanitise_update_contributor() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_contributor BEFORE UPDATE ON contributor FOR EACH ROW EXECUTE PROCEDURE sanitise_update_contributor();

CREATE TABLE testimonial (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID REFERENCES software (id) NOT NULL,
	message VARCHAR(500) NOT NULL,
	source VARCHAR(200) NOT NULL,
	position INTEGER
);

CREATE FUNCTION sanitise_insert_testimonial() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_testimonial BEFORE INSERT ON testimonial FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_testimonial();


CREATE FUNCTION sanitise_update_testimonial() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_testimonial BEFORE UPDATE ON testimonial FOR EACH ROW EXECUTE PROCEDURE sanitise_update_testimonial();
