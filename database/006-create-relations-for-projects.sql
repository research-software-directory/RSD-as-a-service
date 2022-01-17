CREATE TABLE team_member (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	project UUID references project (id) NOT NULL,
	is_contact_person BOOLEAN NOT NULL DEFAULT FALSE,
	email_address VARCHAR,
	family_names VARCHAR NOT NULL,
	given_names VARCHAR NOT NULL,
	name_particle VARCHAR,
	name_suffix VARCHAR,
	avatar_data VARCHAR,
	avatar_mime_type VARCHAR(100),
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE FUNCTION sanitise_insert_team_member() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_team_member BEFORE INSERT ON team_member FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_team_member();


CREATE FUNCTION sanitise_update_team_member() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_team_member BEFORE UPDATE ON team_member FOR EACH ROW EXECUTE PROCEDURE sanitise_update_team_member();
