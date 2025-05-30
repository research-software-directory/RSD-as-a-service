-- SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- returns 0 when any of the ror_names is an exact (ignoring case) match, -1 when not found as substring, the least index otherwise (1-based)
CREATE FUNCTION index_of_ror_query(query VARCHAR, organisation_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS
$$
	DECLARE query_lower VARCHAR := LOWER(query);
	DECLARE ror_names VARCHAR[];
	DECLARE ror_name VARCHAR;
	DECLARE ror_name_lower VARCHAR;
	DECLARE min_index INTEGER;
	BEGIN
	ror_names := (SELECT organisation.ror_names FROM organisation WHERE id = organisation_id);
	IF ror_names IS NULL THEN
		RETURN -1;
	ELSE
		FOREACH ror_name IN ARRAY ror_names LOOP
			CONTINUE WHEN ror_name IS NULL;
			ror_name_lower := LOWER(ror_name);
			IF ror_name_lower = query_lower THEN
				RETURN 0;
			ELSIF POSITION(query_lower IN ror_name_lower) <> 0 THEN
				min_index := LEAST(min_index, POSITION(query_lower IN ror_name_lower));
			END IF;
		END LOOP;
	END IF;
	IF min_index IS NULL THEN
		RETURN -1;
	ELSE
		RETURN min_index;
	END IF;
	END;
$$;

-- GLOBAL SEARCH
-- depends on: aggregated_software_search
CREATE FUNCTION global_search(query VARCHAR) RETURNS TABLE(
	slug VARCHAR,
	domain VARCHAR,
	rsd_host VARCHAR,
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
		aggregated_software_search.rsd_host,
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
				THEN LEAST(NULLIF(POSITION(LOWER(query) IN aggregated_software_search.slug), 0), NULLIF(POSITION(LOWER(query) IN LOWER(aggregated_software_search.brand_name)), 0))
			ELSE 0
		END) AS index_found
	FROM
		aggregated_software_search(query)
	UNION ALL
	-- PROJECT search
	SELECT
		project.slug,
		NULL AS domain,
		NULL as rsd_host,
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
				THEN LEAST(NULLIF(POSITION(LOWER(query) IN project.slug), 0), NULLIF(POSITION(LOWER(query) IN LOWER(project.title)), 0))
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
		NULL as rsd_host,
		organisation."name",
		'organisations' AS "source",
		TRUE AS is_published,
		(CASE
			WHEN organisation.slug ILIKE query OR organisation."name" ILIKE query OR index_of_ror_query(query, organisation.id) = 0 THEN 0
			WHEN organisation.slug ILIKE CONCAT(query, '%') OR organisation."name" ILIKE CONCAT(query, '%') OR index_of_ror_query(query, organisation.id) = 1 THEN 2
			ELSE 3
		END) AS rank,
		(CASE
			WHEN organisation.slug ILIKE query OR organisation."name" ILIKE query OR index_of_ror_query(query, organisation.id) = 0 THEN 0
			WHEN organisation.slug ILIKE CONCAT(query, '%') OR organisation."name" ILIKE CONCAT(query, '%') OR index_of_ror_query(query, organisation.id) = 1 THEN 0
			ELSE
				LEAST(NULLIF(POSITION(LOWER(query) IN organisation.slug), 0), NULLIF(POSITION(LOWER(query) IN LOWER(organisation."name")), 0), NULLIF(index_of_ror_query(query, organisation.id), -1))
		END) AS index_found
	FROM
		organisation
	WHERE
	-- ONLY TOP LEVEL ORGANISATIONS
		organisation.parent IS NULL
		AND
		(organisation.slug ILIKE CONCAT('%', query, '%') OR organisation."name" ILIKE CONCAT('%', query, '%') OR index_of_ror_query(query, organisation.id) >= 0)
	UNION ALL
	-- COMMUNITY search
	SELECT
		community.slug,
		NULL AS domain,
		NULL as rsd_host,
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
				LEAST(NULLIF(POSITION(LOWER(query) IN community.slug), 0), NULLIF(POSITION(LOWER(query) IN LOWER(community."name")), 0))
		END) AS index_found
	FROM
		community
	WHERE
		community.slug ILIKE CONCAT('%', query, '%') OR community."name" ILIKE CONCAT('%', query, '%');

	-- PERSONS search
	SELECT
		public_user_profile.account as slug,
		NULL AS domain,
		NULL as rsd_host,
		public_user_profile.display_name as "name",
		'persons' AS "source",
		public_user_profile.is_public AS is_published,
		(CASE
			WHEN public_user_profile.display_name ILIKE query OR public_user_profile.affiliation ILIKE query THEN 0
			WHEN public_user_profile.display_name ILIKE CONCAT(query, '%') OR public_user_profile.affiliation ILIKE CONCAT(query, '%') THEN 2
			ELSE 3
		END) AS rank,
		0 as index_found
	FROM
		public_user_profile()
	WHERE
		public_user_profile.display_name ILIKE CONCAT('%', query, '%') OR public_user_profile.affiliation ILIKE CONCAT('%', query, '%');
$$;
