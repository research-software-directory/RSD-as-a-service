-- SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 - 2023 dv4all
-- SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
-- SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION varchar_array_to_string(arr VARCHAR[])
RETURNS VARCHAR
LANGUAGE plpgsql
IMMUTABLE
AS
$$
	DECLARE entry VARCHAR;
	DECLARE result VARCHAR := '';
	BEGIN
	IF arr IS NULL THEN
		RETURN NULL;
	END IF;
	FOREACH entry IN ARRAY arr LOOP
		CONTINUE WHEN entry IS NULL;
		IF result = '' THEN result := entry; ELSE result := result || ';' || entry; END IF;
	END LOOP;
	RETURN result;
	END;
$$;

CREATE TABLE organisation (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	parent UUID REFERENCES organisation (id),
	primary_maintainer UUID REFERENCES account (id),
	slug VARCHAR(200) NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	name VARCHAR(200) NOT NULL,
	short_description VARCHAR(300),
	description VARCHAR(10000),
	ror_id VARCHAR(100) UNIQUE CHECK (ror_id ~ '^https://ror\.org/(0[a-hj-km-np-tv-z|0-9]{6}[0-9]{2})$'),
	website VARCHAR(200) UNIQUE,
	is_tenant BOOLEAN DEFAULT FALSE NOT NULL,
	country VARCHAR(100),
	city VARCHAR(100),
	wikipedia_url VARCHAR(300),
	ror_names VARCHAR(200)[],
	ror_names_string VARCHAR GENERATED ALWAYS AS (varchar_array_to_string(ror_names)) STORED,
	ror_types VARCHAR(100)[],
	lat float8,
	lon float8,
	ror_scraped_at TIMESTAMPTZ,
	ror_last_error VARCHAR(500),
	logo_id VARCHAR(40) REFERENCES image(id),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL,
	UNIQUE (slug, parent)
);

CREATE INDEX organisation_parent_idx ON organisation(parent);
CREATE UNIQUE INDEX unique_slug_for_top_level_org_idx ON organisation(slug, (parent IS NULL)) WHERE parent IS NULL;
CREATE UNIQUE INDEX unique_name_and_parent_idx ON organisation(name, parent);

CREATE FUNCTION check_cycle_organisations() RETURNS TRIGGER STABLE LANGUAGE plpgsql SECURITY DEFINER AS
$$
DECLARE initial_org UUID = NEW.id;
DECLARE current_org UUID = NEW.parent;
BEGIN
	WHILE current_org IS NOT NULL LOOP
		IF current_org = initial_org THEN
			RAISE EXCEPTION USING MESSAGE = 'Cycle detected for organisation with id ' || NEW.id;
		END IF;
		SELECT parent FROM organisation WHERE id = current_org INTO current_org;
	END LOOP;
	RETURN NEW;
END
$$;

-- z_ prefix so that if is executed after the sanitise_update_organisation trigger
CREATE TRIGGER z_check_cycle_organisations BEFORE UPDATE OF parent ON organisation FOR EACH ROW EXECUTE PROCEDURE check_cycle_organisations();

CREATE FUNCTION sanitise_insert_organisation() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;

	IF CURRENT_USER = 'rsd_admin' OR (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		RETURN NEW;
	END IF;

	IF NOT NEW.is_tenant AND NEW.parent IS NULL AND NEW.primary_maintainer IS NULL THEN
		RETURN NEW;
	END IF;

	IF (SELECT primary_maintainer FROM organisation o WHERE o.id = NEW.parent) = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
	AND
	NEW.primary_maintainer = (SELECT primary_maintainer FROM organisation o WHERE o.id = NEW.parent)
	THEN
		RETURN NEW;
	END IF;

	RAISE EXCEPTION USING MESSAGE = 'You are not allowed to add this organisation';
END
$$;

CREATE TRIGGER sanitise_insert_organisation BEFORE INSERT ON organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_organisation();


CREATE FUNCTION sanitise_update_organisation() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;

	IF NEW.slug IS DISTINCT FROM OLD.slug AND CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the slug';
	END IF;

	IF CURRENT_USER <> 'rsd_admin' AND NOT (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		IF NEW.is_tenant IS DISTINCT FROM OLD.is_tenant OR NEW.primary_maintainer IS DISTINCT FROM OLD.primary_maintainer THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the tenant status or primary maintainer for organisation ' || OLD.name;
		END IF;
	END IF;

	RETURN NEW;
END
$$;

CREATE TRIGGER sanitise_update_organisation BEFORE UPDATE ON organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_update_organisation();


-- including the parent itself
CREATE FUNCTION list_child_organisations(parent_id UUID) RETURNS TABLE (organisation_id UUID, organisation_name VARCHAR) STABLE LANGUAGE sql AS
$$
WITH RECURSIVE search_tree(id, name) AS (
		SELECT o.id, o.name
		FROM organisation o WHERE id = parent_id
	UNION ALL
		SELECT o.id, o.name
		FROM organisation o, search_tree st
		WHERE o.parent = st.id
)
SELECT * FROM search_tree;
$$;


CREATE FUNCTION list_parent_organisations(id UUID) RETURNS TABLE (slug VARCHAR, organisation_id UUID) STABLE LANGUAGE sql AS
$$
WITH RECURSIVE search_tree(slug, organisation_id, parent) AS (
		SELECT o.slug, o.id, o.parent
		FROM organisation o WHERE o.id = list_parent_organisations.id
	UNION ALL
		SELECT o.slug, o.id, o.parent
		FROM organisation o, search_tree st
		WHERE o.id = st.parent
)
SELECT slug, organisation_id FROM search_tree;
$$;


CREATE FUNCTION slug_to_organisation(full_slug VARCHAR) RETURNS UUID STABLE LANGUAGE plpgsql AS
$$
DECLARE current_org UUID;
DECLARE slug_part VARCHAR;
BEGIN
	FOREACH slug_part IN ARRAY string_to_array(full_slug, '/') LOOP
		SELECT id FROM organisation WHERE (parent = current_org OR (parent IS NULL AND current_org IS NULL)) AND slug = slug_part INTO current_org;
			IF (current_org IS NULL) THEN
				RETURN NULL;
		END IF;
	END LOOP;
	RETURN current_org;
END
$$;


-- ORGANISATION route / path for all organisations
-- we combine slugs of all parent organisation into route
CREATE FUNCTION organisation_route(id UUID) RETURNS TABLE (
	organisation UUID,
	rsd_path VARCHAR,
	parent_names VARCHAR
) STABLE LANGUAGE sql AS
$$
WITH RECURSIVE search_tree(slug, name, organisation_id, parent, reverse_depth) AS (
		SELECT o.slug, o.name, o.id, o.parent, 1
		FROM organisation o WHERE o.id = organisation_route.id
	UNION ALL
		SELECT o.slug, o.name, o.id, o.parent, st.reverse_depth + 1
		FROM organisation o, search_tree st
		WHERE o.id = st.parent
)
SELECT organisation_route.id, STRING_AGG(slug, '/' ORDER BY reverse_depth DESC), STRING_AGG(name, ' > ' ORDER BY reverse_depth DESC) FROM search_tree;
$$;
