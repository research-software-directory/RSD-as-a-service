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
