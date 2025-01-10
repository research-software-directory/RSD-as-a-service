-- SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- GLOBAL SEARCH
-- depends on: aggregated_software_search
CREATE FUNCTION global_search(query VARCHAR) RETURNS TABLE(
	slug VARCHAR,
	domain VARCHAR,
	name VARCHAR,
	source TEXT,
	is_published BOOLEAN,
	rank INTEGER,
	index_found INTEGER
) LANGUAGE sql STABLE AS
$$
	-- AGGREGATED SOFTWARE search
	SELECT
		aggregated_software_search.slug,
		aggregated_software_search.domain,
		aggregated_software_search.brand_name AS name,
		'software' AS "source",
		aggregated_software_search.is_published,
		(CASE
			WHEN aggregated_software_search.slug ILIKE query OR aggregated_software_search.brand_name ILIKE query THEN 0
			WHEN aggregated_software_search.keywords_text ILIKE CONCAT('%', query, '%') THEN 1
			WHEN aggregated_software_search.slug ILIKE CONCAT(query, '%') OR aggregated_software_search.brand_name ILIKE CONCAT(query, '%') THEN 2
			WHEN aggregated_software_search.slug ILIKE CONCAT('%', query, '%') OR aggregated_software_search.brand_name ILIKE CONCAT('%', query, '%') THEN 3
			ELSE 4
		END) AS rank,
		(CASE
			WHEN aggregated_software_search.slug ILIKE query OR aggregated_software_search.brand_name ILIKE query THEN 0
			WHEN aggregated_software_search.keywords_text ILIKE CONCAT('%', query, '%') THEN 0
			WHEN aggregated_software_search.slug ILIKE CONCAT(query, '%') OR aggregated_software_search.brand_name ILIKE CONCAT(query, '%') THEN 0
			WHEN aggregated_software_search.slug ILIKE CONCAT('%', query, '%') OR aggregated_software_search.brand_name ILIKE CONCAT('%', query, '%')
				THEN LEAST(NULLIF(POSITION(query IN aggregated_software_search.slug), 0), NULLIF(POSITION(query IN aggregated_software_search.brand_name), 0))
			ELSE 0
		END) AS index_found
	FROM
		aggregated_software_search(query)
	UNION ALL
	-- PROJECT search
	SELECT
		project.slug,
		NULL AS domain,
		project.title AS name,
		'projects' AS "source",
		project.is_published,
		(CASE
			WHEN project.slug ILIKE query OR project.title ILIKE query THEN 0
			WHEN BOOL_OR(keyword.value ILIKE query) THEN 1
			WHEN project.slug ILIKE CONCAT(query, '%') OR project.title ILIKE CONCAT(query, '%') THEN 2
			WHEN project.slug ILIKE CONCAT('%', query, '%') OR project.title ILIKE CONCAT('%', query, '%') THEN 3
			ELSE 4
		END) AS rank,
		(CASE
			WHEN project.slug ILIKE query OR project.title ILIKE query THEN 0
			WHEN BOOL_OR(keyword.value ILIKE query) THEN 0
			WHEN project.slug ILIKE CONCAT(query, '%') OR project.title ILIKE CONCAT(query, '%') THEN 0
			WHEN project.slug ILIKE CONCAT('%', query, '%') OR project.title ILIKE CONCAT('%', query, '%')
				THEN LEAST(NULLIF(POSITION(query IN project.slug), 0), NULLIF(POSITION(query IN project.title), 0))
			ELSE 0
		END) AS index_found
	FROM
		project
	LEFT JOIN keyword_for_project ON keyword_for_project.project = project.id
	LEFT JOIN keyword ON keyword.id = keyword_for_project.keyword
	GROUP BY project.id
	HAVING
		project.slug ILIKE CONCAT('%', query, '%')
		OR
		project.title ILIKE CONCAT('%', query, '%')
		OR
		project.subtitle ILIKE CONCAT('%', query, '%')
		OR
		BOOL_OR(keyword.value ILIKE CONCAT('%', query, '%'))
	UNION ALL
	-- ORGANISATION search
	SELECT
		organisation.slug,
		NULL AS domain,
		organisation."name",
		'organisations' AS "source",
		TRUE AS is_published,
		(CASE
			WHEN organisation.slug ILIKE query OR organisation."name" ILIKE query THEN 0
			WHEN organisation.slug ILIKE CONCAT(query, '%') OR organisation."name" ILIKE CONCAT(query, '%') THEN 2
			ELSE 3
		END) AS rank,
		(CASE
			WHEN organisation.slug ILIKE query OR organisation."name" ILIKE query THEN 0
			WHEN organisation.slug ILIKE CONCAT(query, '%') OR organisation."name" ILIKE CONCAT(query, '%') THEN 0
			ELSE
				LEAST(NULLIF(POSITION(query IN organisation.slug), 0), NULLIF(POSITION(query IN organisation."name"), 0))
		END) AS index_found
	FROM
		organisation
	WHERE
	-- ONLY TOP LEVEL ORGANISATIONS
		organisation.parent IS NULL
		AND
		(organisation.slug ILIKE CONCAT('%', query, '%') OR organisation."name" ILIKE CONCAT('%', query, '%'))
	UNION ALL
	-- COMMUNITY search
	SELECT
		community.slug,
		NULL AS domain,
		community."name",
		'communities' AS "source",
		TRUE AS is_published,
		(CASE
			WHEN community.slug ILIKE query OR community."name" ILIKE query THEN 0
			WHEN community.slug ILIKE CONCAT(query, '%') OR community."name" ILIKE CONCAT(query, '%') THEN 2
			ELSE 3
		END) AS rank,
		(CASE
			WHEN community.slug ILIKE query OR community."name" ILIKE query THEN 0
			WHEN community.slug ILIKE CONCAT(query, '%') OR community."name" ILIKE CONCAT(query, '%') THEN 0
			ELSE
				LEAST(NULLIF(POSITION(query IN community.slug), 0), NULLIF(POSITION(query IN community."name"), 0))
		END) AS index_found
	FROM
		community
	WHERE
		community.slug ILIKE CONCAT('%', query, '%') OR community."name" ILIKE CONCAT('%', query, '%');
$$;
