-- SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 Netherlands eScience Center
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
