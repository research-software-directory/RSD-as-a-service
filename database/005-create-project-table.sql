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
