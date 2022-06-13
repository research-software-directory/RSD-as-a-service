-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic
-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(100) UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	date_end DATE,
	date_start DATE,
	description VARCHAR,
	grant_id VARCHAR,
	image_caption VARCHAR,
	is_published BOOLEAN DEFAULT FALSE NOT NULL,
	subtitle VARCHAR,
	title VARCHAR NOT NULL,
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
	NEW.slug = OLD.slug;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_project BEFORE UPDATE ON project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_project();


CREATE TABLE url_for_project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	project UUID REFERENCES project (id),
	title VARCHAR NOT NULL,
	url VARCHAR NOT NULL,
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


CREATE TABLE image_for_project (
	project UUID REFERENCES project (id) PRIMARY KEY,
	data VARCHAR NOT NULL,
	mime_type VARCHAR(100) NOT NULL
);


CREATE FUNCTION get_project_image(id UUID) RETURNS BYTEA STABLE LANGUAGE plpgsql AS
$$
DECLARE headers TEXT;
DECLARE blob BYTEA;
DECLARE project_slug VARCHAR;

BEGIN
	SELECT slug FROM project WHERE project.id = get_project_image.id INTO project_slug;
	SELECT format(
		'[{"Content-Type": "%s"},'
		'{"Content-Disposition": "inline; filename=\"%s\""},'
		'{"Cache-Control": "max-age=259200"}]',
		mime_type,
		project_slug)
	FROM image_for_project WHERE project = id INTO headers;

	PERFORM set_config('response.headers', headers, TRUE);

	SELECT decode(image_for_project.data, 'base64') FROM image_for_project WHERE image_for_project.project = get_project_image.id INTO blob;

	IF FOUND
		THEN RETURN(blob);
	ELSE RAISE SQLSTATE 'PT404'
		USING
			message = 'NOT FOUND',
			detail = 'File not found',
			hint = format('%s seems to be an invalid file id', get_project_image.id);
	END IF;
END
$$;
