-- SPDX-FileCopyrightText: 2021 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TYPE mention_type AS ENUM (
	'blogPost',
	'book',
	'bookSection',
	'computerProgram',
	'conferencePaper',
	'dataset',
	'interview',
	'highlight',
	'journalArticle',
	'magazineArticle',
	'newspaperArticle',
	'presentation',
	'report',
	'thesis',
	'videoRecording',
	'webpage',
	'workshop',
	'other'
);

CREATE TABLE mention (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	doi CITEXT UNIQUE CHECK (doi ~ '^10(\.\w+)+/\S+$' AND LENGTH(doi) <= 255),
	doi_registration_date TIMESTAMPTZ,
	url VARCHAR(500) CHECK (url ~ '^https?://'),
	title VARCHAR(500) NOT NULL,
	authors VARCHAR(15000),
	publisher VARCHAR(255),
	publication_year SMALLINT,
	journal VARCHAR(500),
	page VARCHAR(50),
	image_url VARCHAR(500) CHECK (image_url ~ '^https?://'),
	mention_type mention_type NOT NULL,
	source VARCHAR(50) NOT NULL,
	version VARCHAR(100),
	note VARCHAR(500),
	scraped_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_mention() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_mention BEFORE INSERT ON mention FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_mention();


CREATE FUNCTION sanitise_update_mention() RETURNS TRIGGER LANGUAGE plpgsql AS
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


CREATE FUNCTION search_mentions_for_software(software_id UUID, search_text VARCHAR) RETURNS SETOF mention STABLE LANGUAGE plpgsql AS
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


CREATE FUNCTION search_impact_for_project(project_id UUID, search_text VARCHAR) RETURNS SETOF mention STABLE LANGUAGE plpgsql AS
$$
BEGIN
	RETURN QUERY SELECT * FROM mention
	WHERE id NOT IN (
		SELECT mention FROM impact_for_project WHERE impact_for_project.project = project_id
	)
	AND (
		url ILIKE CONCAT('%', search_text, '%') OR title ILIKE CONCAT('%', search_text, '%')
	);
	RETURN;
END
$$;


CREATE FUNCTION search_output_for_project(project_id UUID, search_text VARCHAR) RETURNS SETOF mention STABLE LANGUAGE plpgsql AS
$$
BEGIN
	RETURN QUERY SELECT * FROM mention
	WHERE id NOT IN (
		SELECT mention FROM output_for_project WHERE output_for_project.project = project_id
	)
	AND (
		url ILIKE CONCAT('%', search_text, '%') OR title ILIKE CONCAT('%', search_text, '%')
	);
	RETURN;
END
$$;
