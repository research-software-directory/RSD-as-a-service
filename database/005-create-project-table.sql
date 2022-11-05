-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(200) UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	title VARCHAR(200) NOT NULL,
	subtitle VARCHAR(300),
	date_end DATE,
	date_start DATE,
	description VARCHAR(10000),
	grant_id VARCHAR(50),
	image_caption VARCHAR(500),
	image_contain BOOLEAN DEFAULT FALSE NOT NULL,
	image_id VARCHAR(40) REFERENCES image(id),
	is_published BOOLEAN DEFAULT FALSE NOT NULL,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_project BEFORE INSERT ON project FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_project();


CREATE FUNCTION sanitise_update_project() RETURNS TRIGGER LANGUAGE plpgsql AS
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

CREATE TRIGGER sanitise_update_project BEFORE UPDATE ON project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_project();


CREATE TABLE url_for_project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	project UUID REFERENCES project (id),
	title VARCHAR(100) NOT NULL,
	url VARCHAR(200) NOT NULL CHECK (url ~ '^https?://'),
	position INTEGER
);

CREATE FUNCTION sanitise_insert_url_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_url_for_project BEFORE INSERT ON url_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_url_for_project();


CREATE FUNCTION sanitise_update_url_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_url_for_project BEFORE UPDATE ON url_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_url_for_project();
