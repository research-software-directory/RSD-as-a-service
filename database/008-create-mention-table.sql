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
	is_featured BOOLEAN DEFAULT FALSE NOT NULL,
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



CREATE TABLE mention_for_software (
	mention UUID REFERENCES mention (id),
	software UUID REFERENCES software (id),
	PRIMARY KEY (mention, software)
);


CREATE OR REPLACE FUNCTION search_mentions_for_software(software_id UUID, search_text VARCHAR) RETURNS SETOF mention STABLE LANGUAGE plpgsql AS
$$
BEGIN
	RETURN QUERY SELECT * FROM mention
	WHERE id NOT IN (
		SELECT mention FROM mention_for_software WHERE mention_for_software.software = software_id
	)
	AND (
		url ILIKE CONCAT('%', search_text, '%') OR title ILIKE CONCAT('%', search_text, '%')
	);
	RETURN;
END
$$;




CREATE TABLE output_for_project (
	mention UUID REFERENCES mention (id),
	project UUID REFERENCES project (id),
	PRIMARY KEY (mention, project)
);



CREATE TABLE impact_for_project (
	mention UUID REFERENCES mention (id),
	project UUID REFERENCES project (id),
	PRIMARY KEY (mention, project)
);
