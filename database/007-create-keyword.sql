-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE keyword (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	value CITEXT UNIQUE CHECK (value ~ '^\S+( \S+)*$')
);

CREATE FUNCTION sanitise_insert_keyword() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_keyword BEFORE INSERT ON keyword FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_keyword();


CREATE FUNCTION sanitise_update_keyword() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_keyword BEFORE UPDATE ON keyword FOR EACH ROW EXECUTE PROCEDURE sanitise_update_keyword();


CREATE TABLE keyword_for_software (
	software UUID references software (id),
	keyword UUID references keyword (id),
	PRIMARY KEY (software, keyword)
);

CREATE TABLE keyword_for_project (
	project UUID references project (id),
	keyword UUID references keyword (id),
	PRIMARY KEY (project, keyword)
);

-- ADD basic keywords from topics and tags
INSERT into keyword (value)
VALUES
	('Big data'),
	('GPU'),
	('High performance computing'),
	('Image processing'),
	('Inter-operability & linked data'),
	('Machine learning'),
	('Multi-scale & multi model simulations'),
	('Optimized data handling'),
	('Real time data analysis'),
	('Text analysis & natural language processing'),
	('Visualization'),
	('Workflow technologies');

CREATE VIEW
	project_counts
AS SELECT
	keyword.id AS id,
	count(*) AS count
FROM
	keyword_for_project
INNER JOIN
	keyword
ON
	keyword_for_project.keyword=keyword.id
GROUP BY
	keyword.id;

CREATE VIEW
	software_counts
AS SELECT
	keyword.id AS id,
	count(*) AS count
FROM
	keyword_for_software
INNER JOIN
	keyword
ON
	keyword_for_software.keyword=keyword.id
GROUP BY
	keyword.id;

CREATE VIEW
	combined_counts
AS SELECT
	software_counts.id,
	coalesce(software_counts.count, 0) + coalesce(project_counts.count, 0)
AS
	count
FROM
	software_counts
FULL JOIN
     project_counts
ON
	software_counts.id=project_counts.id
ORDER BY
	count
DESC;
