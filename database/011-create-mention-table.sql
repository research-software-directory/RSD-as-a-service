-- SPDX-FileCopyrightText: 2021 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2024 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 dv4all
-- SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
-- SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
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
	'poster',
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
	openalex_id CITEXT UNIQUE CHECK (openalex_id ~ '^https://openalex\.org/[WwAaSsIiCcPpFf]\d{3,13}$'),
	url VARCHAR(500) CHECK (url ~ '^https?://\S+$'),
	title VARCHAR(3000) NOT NULL,
	authors VARCHAR(50000),
	publisher VARCHAR(255),
	publication_year SMALLINT,
	journal VARCHAR(500),
	page VARCHAR(50),
	image_url VARCHAR(500) CHECK (image_url ~ '^https?://\S+$'),
	mention_type mention_type NOT NULL,
	source VARCHAR(50) NOT NULL,
	version VARCHAR(100),
	note VARCHAR(500),
	scraped_at TIMESTAMPTZ,
	citations_scraped_at TIMESTAMPTZ,
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

CREATE INDEX mention_for_software_software_idx ON mention_for_software(software);


CREATE TABLE reference_paper_for_software (
	mention UUID REFERENCES mention (id),
	software UUID REFERENCES software (id),
	PRIMARY KEY (mention, software)
);

CREATE INDEX reference_paper_for_software_software_idx ON reference_paper_for_software(software);


CREATE TABLE citation_for_mention (
	mention UUID REFERENCES mention (id),
	citation UUID REFERENCES mention (id),
	PRIMARY KEY (mention, citation)
);

CREATE INDEX citation_for_mention_citation_idx ON citation_for_mention(citation);


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

CREATE INDEX output_for_project_project_idx ON output_for_project(project);


CREATE TABLE impact_for_project (
	mention UUID REFERENCES mention (id),
	project UUID REFERENCES project (id),
	PRIMARY KEY (mention, project)
);

CREATE INDEX impact_for_project_project_idx ON impact_for_project(project);


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
