-- SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION delete_community_categories_from_software(software_id UUID, community_id UUID)
RETURNS VOID
LANGUAGE sql AS
$$
DELETE FROM category_for_software
	USING category
	WHERE category_for_software.category_id = category.id AND category_for_software.software_id = software_id AND category.community = community_id;
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
		category_for_software.software_id = software_id AND
		category.organisation = organisation_id;
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
		category_for_project.project_id = project_id AND
		category.organisation = organisation_id;
$$;
