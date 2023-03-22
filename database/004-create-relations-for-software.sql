-- SPDX-FileCopyrightText: 2021 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 - 2023 dv4all
-- SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
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
	license VARCHAR(200),
	star_count BIGINT,
	fork_count INTEGER,
	open_issue_count INTEGER,
	basic_data_scraped_at TIMESTAMPTZ,
	languages JSONB,
	languages_scraped_at TIMESTAMPTZ,
	commit_history JSONB,
	commit_history_scraped_at TIMESTAMPTZ,
	contributor_count INTEGER,
	contributor_count_scraped_at TIMESTAMPTZ
);


CREATE TYPE package_manager_type AS ENUM (
	'anaconda',
	'cran',
	'dockerhub',
	'maven',
	'npm',
	'pypi',
	'other'
);

CREATE TABLE package_manager (
	id UUID PRIMARY KEY,
	software UUID references software (id) NOT NULL,
	url VARCHAR(200) NOT NULL CHECK (url ~ '^https?://'),
	package_manager package_manager_type NOT NULL DEFAULT 'other',
	download_count BIGINT,
	download_count_scraped_at TIMESTAMPTZ,
	reverse_dependency_count INTEGER,
	reverse_dependency_count_scraped_at TIMESTAMPTZ,
	position INTEGER,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_package_manager() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_package_manager BEFORE INSERT ON package_manager FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_package_manager();

-- We do not allow update of url
CREATE FUNCTION sanitise_update_package_manager() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.software = old.software;
	-- NEW.url = old.url;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_package_manager BEFORE UPDATE ON package_manager FOR EACH ROW EXECUTE PROCEDURE sanitise_update_package_manager();



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
