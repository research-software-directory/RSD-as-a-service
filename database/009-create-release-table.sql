-- SPDX-FileCopyrightText: 2021 - 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE release (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID REFERENCES software (id) UNIQUE NOT NULL,
	is_citable BOOLEAN,
	latest_schema_dot_org VARCHAR,
	releases_scraped_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);


CREATE FUNCTION sanitise_insert_release() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_release BEFORE INSERT ON release FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_release();


CREATE FUNCTION sanitise_update_release() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_release BEFORE UPDATE ON release FOR EACH ROW EXECUTE PROCEDURE sanitise_update_release();


CREATE FUNCTION software_join_release() RETURNS TABLE (
	software_id UUID,
	slug VARCHAR,
	concept_doi VARCHAR,
	release_id UUID,
	releases_scraped_at TIMESTAMPTZ
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT software.id AS software_id, software.slug, software.concept_doi, release.id AS release_id, release.releases_scraped_at FROM software LEFT JOIN RELEASE ON software.id = RELEASE.software;
	RETURN;
END
$$;


CREATE TYPE citability AS ENUM (
	'doi-only',
	'full'
);

CREATE TABLE release_content (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	release_id UUID REFERENCES release (id) NOT NULL,
	citability citability NOT NULL,
	date_published DATE NOT NULL,
	doi VARCHAR NOT NULL UNIQUE,
	tag VARCHAR NOT NULL,
	url VARCHAR NOT NULL,
	bibtex VARCHAR,
	cff VARCHAR,
	codemeta VARCHAR,
	endnote VARCHAR,
	ris VARCHAR,
	schema_dot_org VARCHAR
);


CREATE FUNCTION sanitise_insert_release_content() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_release_content BEFORE INSERT ON release_content FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_release_content();


CREATE FUNCTION sanitise_update_release_content() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_release_content BEFORE UPDATE ON release_content FOR EACH ROW EXECUTE PROCEDURE sanitise_update_release_content();
