-- SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
--
-- SPDX-License-Identifier: Apache-2.0

-- DELETE organisation categories for specific community
CREATE FUNCTION delete_community_categories_from_software(software_id UUID, community_id UUID)
RETURNS VOID
LANGUAGE sql AS
$$
DELETE FROM category_for_software
	USING
		category
	WHERE
		category_for_software.category_id = category.id AND
		category_for_software.software_id = delete_community_categories_from_software.software_id AND
		category.community = delete_community_categories_from_software.community_id;
$$;


-- DELETE organisation categories for specific software
CREATE FUNCTION delete_organisation_categories_from_software(software_id UUID, organisation_id UUID)
RETURNS VOID
LANGUAGE sql AS
$$
DELETE FROM category_for_software
	USING
		category
	WHERE
		category_for_software.category_id = category.id AND
		category_for_software.software_id = delete_organisation_categories_from_software.software_id AND
		category.organisation = delete_organisation_categories_from_software.organisation_id;
$$;

-- DELETE organisation categories for specific project
CREATE FUNCTION delete_organisation_categories_from_project(project_id UUID, organisation_id UUID)
RETURNS VOID
LANGUAGE sql AS
$$
DELETE FROM category_for_project
	USING
		category
	WHERE
		category_for_project.category_id = category.id AND
		category_for_project.project_id = delete_organisation_categories_from_project.project_id AND
		category.organisation = delete_organisation_categories_from_project.organisation_id;
$$;

CREATE FUNCTION delete_category_node(category_id UUID)
	RETURNS VOID
	LANGUAGE plpgsql
	SECURITY DEFINER
	VOLATILE
AS
$$
DECLARE child_id UUID;
DECLARE child_ids UUID[];
BEGIN
	IF category_id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide the ID of the category to delete';
	END IF;

	IF
		(SELECT rolsuper FROM pg_roles WHERE rolname = SESSION_USER) IS DISTINCT FROM TRUE
			AND
		(SELECT CURRENT_SETTING('request.jwt.claims', FALSE)::json->>'role') IS DISTINCT FROM 'rsd_admin'
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to delete this category';
	END IF;

	child_ids := (SELECT COALESCE((SELECT ARRAY_AGG(category.id) FROM category WHERE category.parent = delete_category_node.category_id), '{}'));

	FOREACH child_id IN ARRAY child_ids LOOP
		PERFORM delete_category_node(child_id);
	END LOOP;

	DELETE FROM category_for_software WHERE category_for_software.category_id = delete_category_node.category_id;
	DELETE FROM category_for_project WHERE category_for_project.category_id = delete_category_node.category_id;

	DELETE FROM category WHERE category.id = delete_category_node.category_id;
END;
$$;

-- Get categories with allow_software and allow_projects
-- Created using Google search AI Mode
CREATE FUNCTION categories()
RETURNS TABLE (
	id UUID,
	parent UUID,
	community UUID,
	organisation UUID,
	allow_software BOOLEAN,
	allow_projects BOOLEAN,
	short_name VARCHAR(100),
	name VARCHAR(250),
	properties JSONB,
	provenance_iri VARCHAR(250)
) LANGUAGE sql STABLE AS $$
	WITH RECURSIVE category_tree AS (
		-- 1. Anchor Member: Fetch root items (where parent IS NULL)
		-- These items hold the source-of-truth for allow_software and allow_projects
		SELECT
			root.id,
			root.parent,
			root.community,
			root.organisation,
			root.allow_software,
			root.allow_projects,
			root.short_name,
			root.name,
			root.properties,
			root.provenance_iri
		FROM category root
		WHERE root.parent IS NULL

		UNION ALL

		-- 2. Recursive Member: Fetch children and pass down allow... values
		-- Children ignore their own raw columns and pull flags directly from their parent's resolved tree record.
		SELECT
			child.id,
			child.parent,
			child.community,
			child.organisation,
			-- Inherited value passed down
			parent.allow_software,
			-- Inherited value passed down
			parent.allow_projects,
			child.short_name,
			child.name,
			child.properties,
			child.provenance_iri
		FROM category child
		JOIN category_tree parent ON child.parent = parent.id
	)
	SELECT
		id,
		parent,
		community,
		organisation,
		allow_software,
		allow_projects,
		short_name,
		name,
		properties,
		provenance_iri
	FROM category_tree;
$$;
