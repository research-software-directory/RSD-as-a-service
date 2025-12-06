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

-- GLOBAL SEARCH - INCLUDING SHORT_DESCRIPTION
-- depends on: aggregated_software_search, project_search, public_persons_overview
CREATE FUNCTION global_search(query VARCHAR) RETURNS TABLE(
	slug VARCHAR,
	domain VARCHAR,
	rsd_host VARCHAR,
	name VARCHAR,
	short_description VARCHAR,
	source TEXT,
	is_published BOOLEAN,
	image_id VARCHAR,
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
		aggregated_software_search.short_statement as short_description,
		'software' AS "source",
		aggregated_software_search.is_published,
		aggregated_software_search.image_id,
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
		project_search.slug,
		NULL AS domain,
		NULL as rsd_host,
		project_search.title AS name,
		project_search.subtitle as short_description,
		'projects' AS "source",
		project_search.is_published,
		project_search.image_id,
		(CASE
			WHEN project_search.slug ILIKE query OR project_search.title ILIKE query THEN 0
			WHEN project_search.keywords_text ILIKE CONCAT('%', query, '%') THEN 1
			WHEN project_search.slug ILIKE CONCAT(query, '%') OR project_search.title ILIKE CONCAT(query, '%') THEN 2
			WHEN project_search.slug ILIKE CONCAT('%', query, '%') OR project_search.title ILIKE CONCAT('%', query, '%') THEN 3
			ELSE 4
		END) AS rank,
		(CASE
			WHEN project_search.slug ILIKE query OR project_search.title ILIKE query THEN 0
			WHEN project_search.keywords_text ILIKE CONCAT('%', query, '%') THEN 0
			WHEN project_search.slug ILIKE CONCAT(query, '%') OR project_search.title ILIKE CONCAT(query, '%') THEN 0
			WHEN project_search.slug ILIKE CONCAT('%', query, '%') OR project_search.title ILIKE CONCAT('%', query, '%')
				THEN LEAST(NULLIF(POSITION(LOWER(query) IN project_search.slug), 0), NULLIF(POSITION(LOWER(query) IN LOWER(project_search.title)), 0))
			ELSE 0
		END) AS index_found
	FROM
		project_search(query)
	UNION ALL
	-- ORGANISATION search
	SELECT
		organisation.slug,
		NULL AS domain,
		NULL as rsd_host,
		organisation."name",
		organisation.short_description,
		'organisations' AS "source",
		TRUE AS is_published,
		organisation.logo_id AS image_id,
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
		community.short_description,
		'communities' AS "source",
		TRUE AS is_published,
		community.logo_id AS image_id,
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
		community.slug ILIKE CONCAT('%', query, '%') OR community."name" ILIKE CONCAT('%', query, '%')
	UNION ALL
	-- NEWS search
	SELECT
		CONCAT(news.publication_date,'/',news.slug) AS slug,
		NULL AS domain,
		NULL as rsd_host,
		news.title as "name",
		news.summary as short_description,
		'news' AS "source",
		news.is_published,
		image_for_news.image_id,
		(CASE
			WHEN news.title ILIKE query OR news.summary ILIKE query THEN 0
			WHEN news.title ILIKE CONCAT(query, '%') OR news.summary ILIKE CONCAT(query, '%') THEN 1
			WHEN news.title ILIKE CONCAT('%', query, '%') OR news.summary ILIKE CONCAT('%', query, '%') THEN 2
				ELSE 3
			END) AS rank,
			0 as index_found
	FROM
		news
	LEFT JOIN LATERAL (
		SELECT
			image_id
		FROM
			image_for_news
		WHERE
			image_for_news.news = news.id AND
			image_for_news.image_id IS NOT NULL
		ORDER BY
			image_for_news.position
		LIMIT 1
	) image_for_news ON TRUE
	WHERE
		news.title ILIKE CONCAT('%', query, '%') OR news.summary ILIKE CONCAT('%', query, '%')
	UNION ALL
	-- PERSONS search
	SELECT
		CAST (public_persons_overview.account AS VARCHAR) as slug,
		NULL AS domain,
		NULL as rsd_host,
		public_persons_overview.display_name as "name",
		CONCAT (public_persons_overview.role, ', ', public_persons_overview.affiliation) as short_description,
		'persons' AS "source",
		public_persons_overview.is_public AS is_published,
		public_persons_overview.avatar_id AS image_id,
		(CASE
			WHEN public_persons_overview.display_name ILIKE query THEN 0
			WHEN public_persons_overview.display_name ILIKE CONCAT(query, '%') THEN 2
			ELSE 3
		END) AS rank,
		0 as index_found
	FROM
		public_persons_overview()
	WHERE
		public_persons_overview.display_name ILIKE CONCAT('%', query, '%');
$$;