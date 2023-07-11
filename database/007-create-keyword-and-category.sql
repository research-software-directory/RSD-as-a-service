-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

--------------
-- Keywords --
--------------

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

----------------
-- Categories --
----------------

CREATE TABLE category (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	parent UUID references category,
	short_name varchar not null unique,
	name varchar not null unique
);

CREATE TABLE category_for_software (
	software_id UUID references software (id),
	category_id UUID references category (id),
	PRIMARY KEY (software_id, category_id)
);

CREATE FUNCTION category_path(category_id UUID)
RETURNS TABLE (like category)
LANGUAGE SQL STABLE AS
$$
	WITH RECURSIVE cat_path AS (
        SELECT *, 1 AS r_index
          FROM category WHERE id = category_id
        UNION ALL
	    SELECT category.*, cat_path.r_index+1
          FROM category
          JOIN cat_path
          ON category.id = cat_path.parent
	)
-- TODO: How can we reverse the output rows without injecting a new column
-- Now we have to list all columns of `category` explicitely
-- Want to have something like `* without 'r_index''`
	SELECT id, parent, short_name, name
	FROM cat_path
	ORDER BY r_index DESC;
$$;

-- returns a list of `category` entries from tree root to `category_id`
CREATE FUNCTION category_path_expanded(category_id UUID)
RETURNS JSON
LANGUAGE SQL STABLE AS
$$
  SELECT json_agg(row_to_json) AS path FROM (SELECT row_to_json(category_path(category_id))) AS cats;
$$;

CREATE FUNCTION category_paths_by_software_expanded(software_id UUID)
RETURNS JSON
LANGUAGE SQL STABLE AS
$$
  WITH
  cat_ids AS
    (select category_id FROM category_for_software AS c4s WHERE c4s.software_id = software_id),
  paths AS
    (select category_path_expanded(category_id) AS path FROM cat_ids)
  SELECT json_agg(path) AS result FROM paths;
$$;

CREATE FUNCTION available_categories_expanded()
RETURNS JSON
LANGUAGE SQL STABLE AS
$$
  WITH
  cat_ids AS
    (SELECT id AS category_id FROM category AS node WHERE NOT EXISTS (SELECT * FROM category AS sub WHERE node.id = sub.parent)),
  paths AS
    (SELECT category_path_expanded(category_id) AS path FROM cat_ids)
  SELECT json_agg(path) AS result FROM paths;
$$;


-- TODO:
-- check return value for empty result