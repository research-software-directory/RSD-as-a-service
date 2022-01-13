CREATE TABLE account (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE FUNCTION sanitise_insert_account() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_account BEFORE INSERT ON account FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_account();


CREATE FUNCTION sanitise_update_account() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_account BEFORE UPDATE ON account FOR EACH ROW EXECUTE PROCEDURE sanitise_update_account();



CREATE TABLE login_for_account (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	account UUID REFERENCES account (id) NOT NULL,
	sub VARCHAR NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE FUNCTION sanitise_insert_login_for_account() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_login_for_account BEFORE INSERT ON login_for_account FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_login_for_account();


CREATE FUNCTION sanitise_update_login_for_account() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_login_for_account BEFORE UPDATE ON login_for_account FOR EACH ROW EXECUTE PROCEDURE sanitise_update_login_for_account();
