-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
--
-- SPDX-License-Identifier: Apache-2.0
-- SPDX-License-Identifier: EUPL-1.2

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
	id UUID PRIMARY KEY,
	parent UUID REFERENCES category DEFAULT NULL,
	short_name VARCHAR NOT NULL,
	name VARCHAR NOT NULL,

	CONSTRAINT unique_short_name UNIQUE NULLS NOT DISTINCT (parent, short_name),
	CONSTRAINT unique_name UNIQUE NULLS NOT DISTINCT (parent, name)
);

CREATE TABLE category_for_software (
	software_id UUID references software (id),
	category_id UUID references category (id),
	PRIMARY KEY (software_id, category_id)
);


-- sanitize categories

CREATE FUNCTION sanitise_insert_category()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS
$$
BEGIN
	IF NEW.id IS NOT NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'The category id is generated automatically and may not be set.';
	END IF;
	NEW.id = gen_random_uuid();
	RETURN NEW;
END
$$;

CREATE TRIGGER sanitise_insert_category
	BEFORE INSERT ON category
	FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_category();


CREATE FUNCTION sanitise_update_category()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER AS
$$
BEGIN
	IF NEW.id != OLD.id THEN
		RAISE EXCEPTION USING MESSAGE = 'The category id may not be changed.';
	END IF;
	RETURN NEW;
END
$$;

CREATE TRIGGER sanitise_update_category
	BEFORE UPDATE ON category
	FOR EACH ROW EXECUTE PROCEDURE sanitise_update_category();


CREATE FUNCTION check_cycle_categories()
RETURNS TRIGGER STABLE
LANGUAGE plpgsql
SECURITY DEFINER AS
$$
	DECLARE first_id UUID = NEW.id;
	DECLARE current_id UUID = NEW.parent;
BEGIN
	WHILE current_id IS NOT NULL LOOP
		IF current_id = first_id THEN
			RAISE EXCEPTION USING MESSAGE = 'Cycle detected for category with id ' || NEW.id;
		END IF;
		SELECT parent FROM category WHERE id = current_id INTO current_id;
	END LOOP;
	RETURN NEW;
END
$$;

CREATE TRIGGER zzz_check_cycle_categories  -- triggers are executed in alphabetical order
	AFTER INSERT OR UPDATE ON category
	FOR EACH ROW EXECUTE PROCEDURE check_cycle_categories();


-- helper functions

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
	-- I want to have something like `* without 'r_index'` to be independant from modifications of `category`
	-- TODO: check SEARCH keyword
	SELECT id, parent, short_name, name
	FROM cat_path
	ORDER BY r_index DESC;
$$;

-- returns a list of `category` entries traversing from the tree root to entry with `category_id`
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
		(SELECT category_id FROM category_for_software AS c4s WHERE c4s.software_id = category_paths_by_software_expanded.software_id),
	paths as
		(SELECT category_path_expanded(category_id) AS path FROM cat_ids)
	SELECT
		CASE WHEN EXISTS(SELECT 1 FROM cat_ids) THEN (SELECT json_agg(path) FROM paths)
		ELSE '[]'::json
		END as result
$$;


CREATE FUNCTION available_categories_expanded()
RETURNS JSON
LANGUAGE SQL STABLE AS
$$
	WITH
	cat_ids AS
		(SELECT id AS category_id FROM category AS node WHERE NOT EXISTS (SELECT 1 FROM category AS sub WHERE node.id = sub.parent)),
	paths AS
		(SELECT category_path_expanded(category_id) AS path FROM cat_ids)
	SELECT
		CASE WHEN EXISTS(SELECT 1 FROM cat_ids) THEN (SELECT json_agg(path) AS result FROM paths)
		ELSE '[]'::json
		END
$$
