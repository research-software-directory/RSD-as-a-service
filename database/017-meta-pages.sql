-- SPDX-FileCopyrightText: 2021 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2024 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

-- CUSTOM META PAGES TO BE ADDED TO RSD
-- THE PAGES ARE LISTED IN THE FOOTER

CREATE TABLE meta_pages (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(100) UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	title VARCHAR(100) NOT NULL,
	description VARCHAR(30000),
	is_published BOOLEAN DEFAULT FALSE NOT NULL,
	position INTEGER,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);


CREATE FUNCTION sanitise_insert_meta_pages() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_meta_pages BEFORE INSERT ON meta_pages
	FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_meta_pages();


CREATE FUNCTION sanitise_update_meta_pages() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;

	IF NEW.slug IS DISTINCT FROM OLD.slug AND CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (
		SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER
	) IS DISTINCT FROM TRUE
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the slug';
	END IF;

	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_meta_pages BEFORE UPDATE ON meta_pages
	FOR EACH ROW EXECUTE PROCEDURE sanitise_update_meta_pages();
