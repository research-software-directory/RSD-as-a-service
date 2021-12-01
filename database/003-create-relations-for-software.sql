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

