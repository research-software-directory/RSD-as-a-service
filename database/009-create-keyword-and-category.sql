-- SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
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


-- KEYWORDS for community
CREATE TABLE keyword_for_community (
	community UUID REFERENCES community (id),
	keyword UUID REFERENCES keyword (id),
	PRIMARY KEY (community, keyword)
);


----------------
-- Categories --
----------------

CREATE TABLE category (
	id UUID PRIMARY KEY,
	parent UUID REFERENCES category DEFAULT NULL,
	community UUID REFERENCES community(id) DEFAULT NULL,
	short_name VARCHAR(100) NOT NULL,
	name VARCHAR(250) NOT NULL,
	properties JSONB NOT NULL DEFAULT '{}'::jsonb,
	provenance_iri VARCHAR(250) DEFAULT NULL,  -- e.g. https://www.w3.org/TR/skos-reference/#mapping

	CONSTRAINT unique_short_name UNIQUE NULLS NOT DISTINCT (parent, short_name, community),
	CONSTRAINT unique_name UNIQUE NULLS NOT DISTINCT (parent, name, community),
	CONSTRAINT invalid_value_for_properties CHECK (properties - '{icon, is_highlight, description, subtitle}'::text[] = '{}'::jsonb),
	CONSTRAINT highlight_must_be_top_level_category CHECK (NOT ((properties->>'is_highlight')::boolean AND parent IS NOT NULL))
);

CREATE INDEX category_parent_idx ON category (parent);
CREATE INDEX category_community_idx ON category (community);


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
	IF NEW.parent IS NOT NULL AND (SELECT community FROM category WHERE id = NEW.parent) IS DISTINCT FROM NEW.community THEN
		RAISE EXCEPTION USING MESSAGE = 'The community must be the same as of its parent.';
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
	IF NEW.community IS DISTINCT FROM OLD.community THEN
		RAISE EXCEPTION USING MESSAGE = 'The community this category belongs to may not be changed.';
	END IF;
	IF NEW.parent IS NOT NULL AND (SELECT community FROM category WHERE id = NEW.parent) IS DISTINCT FROM NEW.community THEN
		RAISE EXCEPTION USING MESSAGE = 'The community must be the same as of its parent.';
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
RETURNS TABLE (LIKE category)
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
	-- 1. How can we reverse the output rows without injecting a new column (r_index)?
	-- 2. How a table row "type" could be used here Now we have to list all columns of `category` explicitly
	--    I want to have something like `* without 'r_index'` to be independent from modifications of `category`
	-- 3. Maybe this could be improved by using SEARCH keyword.
	SELECT id, parent, community, short_name, name, properties, provenance_iri
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
	paths AS
		(SELECT category_path_expanded(category_id) AS path FROM cat_ids)
	SELECT
		CASE WHEN EXISTS(SELECT 1 FROM cat_ids) THEN (SELECT json_agg(path) FROM paths)
		ELSE '[]'::json
		END AS result
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
