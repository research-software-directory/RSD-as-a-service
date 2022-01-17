CREATE TABLE project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(100) UNIQUE NOT NULL,
	call_url VARCHAR,
	code_url VARCHAR,
	data_management_plan_url VARCHAR,
	date_end DATE,
	date_start DATE,
	description VARCHAR,
	grant_id VARCHAR,
	home_url VARCHAR,
	image_caption VARCHAR,
	is_published BOOLEAN DEFAULT FALSE NOT NULL,
	software_sustainability_plan_url VARCHAR,
	subtitle VARCHAR,
	title VARCHAR,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE TABLE image_for_project (
	project UUID references project (id) PRIMARY KEY,
	data VARCHAR,
	mime_type VARCHAR(100)
);

CREATE FUNCTION sanitise_insert_project() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_project BEFORE INSERT ON project FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_project();


CREATE FUNCTION sanitise_update_project() RETURNS TRIGGER LANGUAGE plpgsql as
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
