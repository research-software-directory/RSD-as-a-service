CREATE TABLE organisation (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(100) UNIQUE,
	parent UUID REFERENCES organisation (id),
	primary_maintainer UUID REFERENCES account (id),
	name VARCHAR UNIQUE NOT NULL,
	ror_id VARCHAR UNIQUE,
	website VARCHAR UNIQUE,
	is_tenant BOOLEAN DEFAULT FALSE NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE FUNCTION sanitise_insert_organisation() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_organisation BEFORE INSERT ON organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_organisation();


CREATE FUNCTION sanitise_update_organisation() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	NEW.slug = OLD.slug;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_organisation BEFORE UPDATE ON organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_update_organisation();


CREATE OR REPLACE FUNCTION list_parent_organisations(child_organisation UUID) RETURNS TABLE (slug VARCHAR, organisation_id UUID) STABLE LANGUAGE plpgsql AS
$$
DECLARE current_org UUID = child_organisation;
BEGIN
	WHILE current_org IS NOT NULL LOOP
		RETURN QUERY SELECT organisation.slug, id FROM organisation WHERE id = current_org;
		SELECT parent FROM organisation WHERE id = current_org INTO current_org;
	END LOOP;
	RETURN;
END
$$;



CREATE TABLE logo_for_organisation (
	id UUID references organisation(id) PRIMARY KEY,
	data VARCHAR NOT NULL,
	mime_type VARCHAR(100) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE FUNCTION get_logo(id UUID) RETURNS BYTEA STABLE LANGUAGE plpgsql AS
$$
DECLARE headers TEXT;
DECLARE blob BYTEA;

BEGIN
	SELECT format(
		'[{"Content-Type": "%s"},'
		'{"Content-Disposition": "inline; filename=\"%s\""},'
		'{"Cache-Control": "max-age=259200"}]',
		logo_for_organisation.mime_type,
		logo_for_organisation.id)
	FROM logo_for_organisation WHERE logo_for_organisation.id = get_logo.id INTO headers;

	PERFORM set_config('response.headers', headers, TRUE);

	SELECT decode(logo_for_organisation.data, 'base64') FROM logo_for_organisation WHERE logo_for_organisation.id = get_logo.id INTO blob;

	IF FOUND
		THEN RETURN(blob);
	ELSE RAISE SQLSTATE 'PT404'
		USING
			message = 'NOT FOUND',
			detail = 'File not found',
			hint = format('%s seems to be an invalid file id', get_logo.id);
	END IF;
END
$$;
