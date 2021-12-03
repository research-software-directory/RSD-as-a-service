CREATE TYPE mention_type as ENUM (
	'attachment',
	'blogPost',
	'book',
	'bookSection',
	'computerProgram',
	'conferencePaper',
	'document',
	'interview',
	'journalArticle',
	'magazineArticle',
	'manuscript',
	'newspaperArticle',
	'note',
	'presentation',
	'radioBroadcast',
	'report',
	'thesis',
	'videoRecording',
	'webpage'
);

CREATE TABLE mention (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	author VARCHAR,
	date TIMESTAMP,
	image VARCHAR,
	is_corporate_blog BOOLEAN NOT NULL,
	title VARCHAR NOT NULL,
	type mention_type NOT NULL,
	url VARCHAR,
	version INTEGER,
	zotero_key VARCHAR,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL
);

CREATE FUNCTION sanitise_insert_mention() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_mention BEFORE INSERT ON mention FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_mention();


CREATE FUNCTION sanitise_update_mention() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_mention BEFORE UPDATE ON mention FOR EACH ROW EXECUTE PROCEDURE sanitise_update_mention();



CREATE TABLE mention_for_software(
	mention UUID REFERENCES mention (id),
	software UUID REFERENCES software (id),
	PRIMARY KEY (mention, software)
);
