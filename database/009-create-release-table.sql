CREATE TABLE release (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID REFERENCES software (id) UNIQUE NOT NULL,
	is_citable BOOLEAN,
	latest_schema_dot_org VARCHAR,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);


CREATE FUNCTION sanitise_insert_release() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_release BEFORE INSERT ON release FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_release();


CREATE FUNCTION sanitise_update_release() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_release BEFORE UPDATE ON release FOR EACH ROW EXECUTE PROCEDURE sanitise_update_release();



CREATE TYPE citability as ENUM (
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


CREATE FUNCTION sanitise_insert_release_content() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_release_content BEFORE INSERT ON release_content FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_release_content();


CREATE FUNCTION sanitise_update_release_content() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_release_content BEFORE UPDATE ON release_content FOR EACH ROW EXECUTE PROCEDURE sanitise_update_release_content();
