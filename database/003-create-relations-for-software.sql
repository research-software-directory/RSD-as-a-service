CREATE TABLE repository_url (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID references software (id) NOT NULL,
	url VARCHAR NOT NULL
);


CREATE FUNCTION sanitise_insert_repository_url() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_repository_url BEFORE INSERT ON software FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_repository_url();


CREATE FUNCTION sanitise_update_repository_url() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_repository_url BEFORE UPDATE ON software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_repository_url();



CREATE TABLE license_for_software (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID references software (id) NOT NULL,
	license VARCHAR(100) NOT NULL
);

CREATE FUNCTION sanitise_insert_license_for_software() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_license_for_software BEFORE INSERT ON license_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_license_for_software();


CREATE FUNCTION sanitise_update_license_for_software() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_license_for_software BEFORE UPDATE ON license_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_license_for_software();



CREATE TABLE contributor (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID references software (id) NOT NULL,
	is_contact_person BOOLEAN NOT NULL DEFAULT FALSE,
	email_address VARCHAR,
	family_names VARCHAR NOT NULL,
	given_names VARCHAR NOT NULL,
	name_particle VARCHAR,
	name_suffix VARCHAR,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE FUNCTION sanitise_insert_contributor() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_contributor BEFORE INSERT ON contributor FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_contributor();


CREATE FUNCTION sanitise_update_contributor() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_contributor BEFORE UPDATE ON contributor FOR EACH ROW EXECUTE PROCEDURE sanitise_update_contributor();
