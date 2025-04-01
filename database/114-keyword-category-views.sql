-- SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION category_for_software_status(software_id UUID, category_id UUID)
	RETURNS VARCHAR
	LANGUAGE SQL
	STABLE
AS
$$
WITH
	category_data AS (SELECT organisation, community FROM category WHERE category.id = category_id)
SELECT
	CASE
		WHEN (SELECT organisation FROM category_data) IS NULL AND (SELECT community FROM category_data) IS NULL THEN 'global'
		WHEN (SELECT organisation FROM category_data AS organisation_id) IS NOT NULL THEN (SELECT status FROM software_for_organisation WHERE software_for_organisation.software = software_id AND software_for_organisation.organisation = (SELECT organisation FROM category_data AS organisation_id))::VARCHAR
		WHEN (SELECT community FROM category_data) IS NOT NULL THEN (SELECT status FROM software_for_community WHERE software_for_community.software = software_id AND software_for_community.community = (SELECT community FROM category_data))::VARCHAR
		ELSE 'other'
		END
$$;


-- RPC for software page to show all software categories
CREATE FUNCTION category_paths_by_software_expanded(software_id UUID)
	RETURNS JSONB
	LANGUAGE SQL STABLE AS
$$
SELECT COALESCE(jsonb_agg(paths.content),  jsonb_build_array())::JSONB FROM (
	SELECT ARRAY_AGG(rows) AS content FROM (
		SELECT category_for_software.category_id, category_path.*, category_for_software_status AS status
		FROM category_for_software
		INNER JOIN category_path(category_for_software.category_id) ON TRUE
		INNER JOIN category_for_software_status(category_paths_by_software_expanded.software_id, category_path.id) ON TRUE
		WHERE category_for_software.software_id = category_paths_by_software_expanded.software_id
	) AS rows
	GROUP BY rows.category_id
) AS paths
$$;


CREATE FUNCTION category_for_project_status(project_id UUID, category_id UUID)
	RETURNS VARCHAR
	LANGUAGE SQL
	STABLE
AS
$$
WITH
	category_data AS (SELECT organisation FROM category WHERE category.id = category_id)
SELECT
	CASE
		WHEN (SELECT organisation FROM category_data) IS NULL THEN 'global'
		WHEN (SELECT organisation FROM category_data AS organisation_id) IS NOT NULL THEN (SELECT status FROM project_for_organisation WHERE project_for_organisation.project = project_id AND project_for_organisation.organisation = (SELECT organisation FROM category_data AS organisation_id) AND role = 'participating')::VARCHAR
		ELSE 'other'
		END
$$;


-- RPC for project page to show all project categories
CREATE FUNCTION category_paths_by_project_expanded(project_id UUID)
	RETURNS JSONB
	LANGUAGE SQL STABLE AS
$$
SELECT COALESCE(jsonb_agg(paths.content),  jsonb_build_array())::JSONB FROM (
	SELECT ARRAY_AGG(rows) AS content FROM (
		SELECT category_for_project.category_id, category_path.*, category_for_project_status AS status
		FROM category_for_project
		INNER JOIN category_path(category_for_project.category_id) ON TRUE
		INNER JOIN category_for_project_status(category_paths_by_project_expanded.project_id, category_path.id) ON TRUE
		WHERE category_for_project.project_id = category_paths_by_project_expanded.project_id
	) AS rows
	GROUP BY rows.category_id
) AS paths
$$;
