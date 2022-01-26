CREATE TABLE programming_languages (
	repository_url UUID PRIMARY KEY REFERENCES repository_url (id),
	languages JSONB NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE FUNCTION sanitise_insert_programming_languages() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_programming_languages BEFORE INSERT ON programming_languages FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_programming_languages();


CREATE FUNCTION sanitise_update_programming_languages() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.repository_url = OLD.repository_url;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_programming_languages BEFORE UPDATE ON programming_languages FOR EACH ROW EXECUTE PROCEDURE sanitise_update_programming_languages();
