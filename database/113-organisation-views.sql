-- SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION delete_organisation(id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
VOLATILE
AS
$$
DECLARE child_id UUID;
DECLARE child_ids UUID[];
DECLARE category_id UUID;
DECLARE category_ids UUID[];
BEGIN
	IF id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide the ID of the organisation to delete';
	END IF;

	IF
		(SELECT rolsuper FROM pg_roles WHERE rolname = SESSION_USER) IS DISTINCT FROM TRUE
		AND
		(SELECT CURRENT_SETTING('request.jwt.claims', FALSE)::json->>'role') IS DISTINCT FROM 'rsd_admin'
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to delete this organisation';
	END IF;

	child_ids := (SELECT COALESCE((SELECT ARRAY_AGG(organisation.id) FROM organisation WHERE organisation.parent = delete_organisation.id), '{}'));

	FOREACH child_id IN ARRAY child_ids LOOP
		PERFORM delete_organisation(child_id);
	END LOOP;

	category_ids := (SELECT COALESCE((SELECT ARRAY_AGG(category.id) FROM category WHERE category.organisation = delete_organisation.id), '{}'));

	FOREACH category_id IN ARRAY category_ids LOOP
		PERFORM delete_category_node(category_id);
	END LOOP;

	DELETE FROM invite_maintainer_for_organisation WHERE invite_maintainer_for_organisation.organisation = delete_organisation.id;
	DELETE FROM maintainer_for_organisation WHERE maintainer_for_organisation.organisation = delete_organisation.id;
	DELETE FROM project_for_organisation WHERE project_for_organisation.organisation = delete_organisation.id;
	DELETE FROM software_for_organisation WHERE software_for_organisation.organisation = delete_organisation.id;

	DELETE FROM organisation WHERE organisation.id = delete_organisation.id;
END
$$;

-- CATEGORIES for projects of specific organisation
CREATE FUNCTION org_project_categories(organisation_id UUID) RETURNS TABLE(
	project UUID,
	category VARCHAR[]
) LANGUAGE sql STABLE AS
$$
	SELECT
		category_for_project.project_id AS project,
		ARRAY_AGG(
			DISTINCT category_path.short_name
			ORDER BY category_path.short_name
		) AS category
	FROM
		category_for_project
	INNER JOIN
		category_path(category_for_project.category_id) ON TRUE
	WHERE
		category_path.organisation = organisation_id
	GROUP BY
		category_for_project.project_id;
$$;

-- Project info by organisation
-- we filter this view at least by organisation_id (uuid)
CREATE FUNCTION projects_by_organisation(organisation_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	date_start DATE,
	date_end DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	image_id VARCHAR,
	is_featured BOOLEAN,
	status relation_status,
	keywords citext[],
	research_domain VARCHAR[],
	participating_organisations VARCHAR[],
	categories VARCHAR[],
	impact_cnt INTEGER,
	output_cnt INTEGER,
	project_status VARCHAR(20)
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT ON (project.id)
	project.id,
	project.slug,
	project.title,
	project.subtitle,
	project.date_start,
	project.date_end,
	project.updated_at,
	project.is_published,
	project.image_contain,
	project.image_id,
	project_for_organisation.is_featured,
	project_for_organisation.status,
	keyword_filter_for_project.keywords,
	research_domain_filter_for_project.research_domain,
	project_participating_organisations.organisations AS participating_organisations,
	org_project_categories.category AS categories,
	COALESCE(count_project_impact.impact_cnt, 0) AS impact_cnt,
	COALESCE(count_project_output.output_cnt, 0) AS output_cnt,
	project_status.status
FROM
	project
LEFT JOIN
	project_for_organisation ON project.id = project_for_organisation.project
LEFT JOIN
	keyword_filter_for_project() ON project.id=keyword_filter_for_project.project
LEFT JOIN
	research_domain_filter_for_project() ON project.id=research_domain_filter_for_project.project
LEFT JOIN
	project_participating_organisations() ON project.id=project_participating_organisations.project
LEFT JOIN
	org_project_categories(organisation_id) ON project.id=org_project_categories.project
LEFT JOIN
	count_project_impact() ON project.id = count_project_impact.project
LEFT JOIN
	count_project_output() ON project.id = count_project_output.project
LEFT JOIN
	project_status() ON project.id=project_status.project
WHERE
	project_for_organisation.organisation IN (
		SELECT list_child_organisations.organisation_id FROM list_child_organisations(organisation_id)
	)
;
$$;

-- PROJECT OVERVIEW LIST FOR SEARCH
-- WITH keywords, research domain and participating organisations for filtering
CREATE FUNCTION projects_by_organisation_search(
	organisation_id UUID,
	search VARCHAR
) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	date_start DATE,
	date_end DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	image_id VARCHAR,
	is_featured BOOLEAN,
	status relation_status,
	keywords citext[],
	research_domain VARCHAR[],
	participating_organisations VARCHAR[],
	categories VARCHAR[],
	impact_cnt INTEGER,
	output_cnt INTEGER,
	project_status VARCHAR(20)
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT ON (project.id)
	project.id,
	project.slug,
	project.title,
	project.subtitle,
	project.date_start,
	project.date_end,
	project.updated_at,
	project.is_published,
	project.image_contain,
	project.image_id,
	project_for_organisation.is_featured,
	project_for_organisation.status,
	keyword_filter_for_project.keywords,
	research_domain_filter_for_project.research_domain,
	project_participating_organisations.organisations AS participating_organisations,
	org_project_categories.category AS categories,
	COALESCE(count_project_impact.impact_cnt, 0) AS impact_cnt,
	COALESCE(count_project_output.output_cnt, 0) AS output_cnt,
	project_status.status
FROM
	project
LEFT JOIN
	project_for_organisation ON project.id = project_for_organisation.project
LEFT JOIN
	keyword_filter_for_project() ON project.id=keyword_filter_for_project.project
LEFT JOIN
	research_domain_filter_for_project() ON project.id=research_domain_filter_for_project.project
LEFT JOIN
	project_participating_organisations() ON project.id=project_participating_organisations.project
LEFT JOIN
	org_project_categories(organisation_id) ON project.id=org_project_categories.project
LEFT JOIN
	count_project_impact() ON project.id = count_project_impact.project
LEFT JOIN
	count_project_output() ON project.id = count_project_output.project
LEFT JOIN
	project_status() ON project.id=project_status.project
WHERE
	project_for_organisation.organisation IN (
		SELECT list_child_organisations.organisation_id FROM list_child_organisations(organisation_id)
	) AND (
		project.title ILIKE CONCAT('%', search, '%')
		OR
		project.slug ILIKE CONCAT('%', search, '%')
		OR
		project.subtitle ILIKE CONCAT('%', search, '%')
		OR
		keyword_filter_for_project.keywords_text ILIKE CONCAT('%', search, '%')
		OR
		research_domain_filter_for_project.research_domain_text ILIKE CONCAT('%', search, '%')
	)
ORDER BY
	project.id,
	CASE
		WHEN title ILIKE search THEN 0
		WHEN title ILIKE CONCAT(search, '%') THEN 1
		WHEN title ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END,
	CASE
		WHEN slug ILIKE search THEN 0
		WHEN slug ILIKE CONCAT(search, '%') THEN 1
		WHEN slug ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END,
	CASE
		WHEN subtitle ILIKE search THEN 0
		WHEN subtitle ILIKE CONCAT(search, '%') THEN 1
		WHEN subtitle ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END
;
$$;

-- REACTIVE KEYWORD FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE KEYWORDS FOR APPLIED FILTERS
CREATE FUNCTION org_project_keywords_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	status_filter VARCHAR DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	keyword CITEXT,
	keyword_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(keywords) AS keyword,
	COUNT(id) AS keyword_cnt
FROM
	projects_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
	AND
	COALESCE(categories, '{}') @> category_filter
	AND
		CASE
			WHEN status_filter <> '' THEN project_status = status_filter
			ELSE true
		END
GROUP BY
	keyword
;
$$;

-- REACTIVE RESEARCH DOMAIN FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE DOMAINS FOR APPLIED FILTERS
CREATE FUNCTION org_project_domains_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	status_filter VARCHAR DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	domain VARCHAR,
	domain_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(research_domain) AS domain,
	COUNT(id) AS domain_cnt
FROM
	projects_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
	AND
	COALESCE(categories, '{}') @> category_filter
	AND
		CASE
			WHEN status_filter <> '' THEN project_status = status_filter
			ELSE true
		END
GROUP BY
	domain
;
$$;

-- REACTIVE PARTICIPATING ORGANISATIONS FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE DOMAINS FOR APPLIED FILTERS
CREATE FUNCTION org_project_participating_organisations_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	status_filter VARCHAR DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	organisation VARCHAR,
	organisation_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(participating_organisations) AS organisation,
	COUNT(id) AS organisation_cnt
FROM
	projects_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
	AND
	COALESCE(categories, '{}') @> category_filter
	AND
		CASE
			WHEN status_filter <> '' THEN project_status = status_filter
			ELSE true
		END
GROUP BY
	organisation
;
$$;

-- REACTIVE PROJECT STATUS WITH COUNTS
-- PROVIDES AVAILABLE DOMAINS FOR APPLIED FILTERS
CREATE FUNCTION org_project_status_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	project_status VARCHAR,
	project_status_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	project_status,
	COUNT(id) AS project_status_cnt
FROM
	projects_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
	AND
	COALESCE(categories, '{}') @> category_filter
GROUP BY
	project_status
;
$$;

-- REACTIVE ORGANISATION CATEGORIES FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE CATEGORIES FOR APPLIED FILTERS
CREATE FUNCTION org_project_categories_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	status_filter VARCHAR DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	category VARCHAR,
	category_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(categories) AS category,
	-- count per project on unique project id
	COUNT(DISTINCT(id)) AS category_cnt
FROM
	projects_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
	AND
	COALESCE(categories, '{}') @> category_filter
	AND
		CASE
			WHEN status_filter <> '' THEN project_status = status_filter
			ELSE true
		END
GROUP BY
	category
;
$$;

-- CATEGORIES for software of specific organisation
CREATE FUNCTION org_software_categories(organisation_id UUID) RETURNS TABLE(
	software UUID,
	category VARCHAR[]
) LANGUAGE sql STABLE AS
$$
	SELECT
		category_for_software.software_id AS software,
		ARRAY_AGG(
			DISTINCT category_path.short_name
			ORDER BY category_path.short_name
		) AS category
	FROM
		category_for_software
	INNER JOIN
		category_path(category_for_software.category_id) ON TRUE
	WHERE
		category_path.organisation = organisation_id
	GROUP BY
		category_for_software.software_id;
$$;

-- SOFTWARE info by organisation
-- we filter this view at least by organisation_id (uuid)
CREATE FUNCTION software_by_organisation(organisation_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	image_id VARCHAR,
	is_published BOOLEAN,
	updated_at TIMESTAMPTZ,
	is_featured BOOLEAN,
	status relation_status,
	keywords CITEXT[],
	prog_lang TEXT[],
	licenses VARCHAR[],
	categories VARCHAR[],
	contributor_cnt BIGINT,
	mention_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT ON (software.id)
	software.id,
	software.slug,
	software.brand_name,
	software.short_statement,
	software.image_id,
	software.is_published,
	software.updated_at,
	software_for_organisation.is_featured,
	software_for_organisation.status,
	keyword_filter_for_software.keywords,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses,
	org_software_categories.category AS categories,
	count_software_contributors.contributor_cnt,
	count_software_mentions.mention_cnt
FROM
	software
LEFT JOIN
	software_for_organisation ON software.id=software_for_organisation.software
LEFT JOIN
	count_software_contributors() ON software.id=count_software_contributors.software
LEFT JOIN
	count_software_mentions() ON software.id=count_software_mentions.software
LEFT JOIN
	keyword_filter_for_software() ON software.id=keyword_filter_for_software.software
LEFT JOIN
	prog_lang_filter_for_software() ON software.id=prog_lang_filter_for_software.software
LEFT JOIN
	license_filter_for_software() ON software.id=license_filter_for_software.software
LEFT JOIN
	org_software_categories(organisation_id) ON software.id=org_software_categories.software
WHERE
	software_for_organisation.organisation IN (
		SELECT list_child_organisations.organisation_id FROM list_child_organisations(organisation_id)
	)
;
$$;

-- SOFTWARE OF ORGANISATION LIST FOR SEARCH
-- WITH keywords, programming languages and licenses for filtering
CREATE FUNCTION software_by_organisation_search(
	organisation_id UUID,
	search VARCHAR
) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	image_id VARCHAR,
	is_published BOOLEAN,
	updated_at TIMESTAMPTZ,
	is_featured BOOLEAN,
	status relation_status,
	keywords CITEXT[],
	prog_lang TEXT[],
	licenses VARCHAR[],
	categories VARCHAR[],
	contributor_cnt BIGINT,
	mention_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT ON (software.id)
	software.id,
	software.slug,
	software.brand_name,
	software.short_statement,
	software.image_id,
	software.is_published,
	software.updated_at,
	software_for_organisation.is_featured,
	software_for_organisation.status,
	keyword_filter_for_software.keywords,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses,
	org_software_categories.category AS categories,
	count_software_contributors.contributor_cnt,
	count_software_mentions.mention_cnt
FROM
	software
LEFT JOIN
	software_for_organisation ON software.id=software_for_organisation.software
LEFT JOIN
	count_software_contributors() ON software.id=count_software_contributors.software
LEFT JOIN
	count_software_mentions() ON software.id=count_software_mentions.software
LEFT JOIN
	keyword_filter_for_software() ON software.id=keyword_filter_for_software.software
LEFT JOIN
	prog_lang_filter_for_software() ON software.id=prog_lang_filter_for_software.software
LEFT JOIN
	license_filter_for_software() ON software.id=license_filter_for_software.software
LEFT JOIN
	org_software_categories(organisation_id) ON software.id=org_software_categories.software
WHERE
	software_for_organisation.organisation IN (
		SELECT list_child_organisations.organisation_id FROM list_child_organisations(organisation_id)
	) AND (
		software.brand_name ILIKE CONCAT('%', search, '%')
		OR
		software.slug ILIKE CONCAT('%', search, '%')
		OR
		software.short_statement ILIKE CONCAT('%', search, '%')
		OR
		keyword_filter_for_software.keywords_text ILIKE CONCAT('%', search, '%')
	)
ORDER BY
	software.id,
	CASE
		WHEN brand_name ILIKE search THEN 0
		WHEN brand_name ILIKE CONCAT(search, '%') THEN 1
		WHEN brand_name ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END,
	CASE
		WHEN slug ILIKE search THEN 0
		WHEN slug ILIKE CONCAT(search, '%') THEN 1
		WHEN slug ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END,
	CASE
		WHEN short_statement ILIKE search THEN 0
		WHEN short_statement ILIKE CONCAT(search, '%') THEN 1
		WHEN short_statement ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END
;
$$;

-- REACTIVE KEYWORD FILTER WITH COUNTS FOR SOFTWARE
-- PROVIDES AVAILABLE KEYWORDS FOR APPLIED FILTERS
CREATE FUNCTION org_software_keywords_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	keyword CITEXT,
	keyword_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(keywords) AS keyword,
	COUNT(id) AS keyword_cnt
FROM
	software_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	COALESCE(categories, '{}') @> category_filter
GROUP BY
	keyword
;
$$;

-- REACTIVE PROGRAMMING LANGUAGES WITH COUNTS FOR SOFTWARE
-- PROVIDES AVAILABLE PROGRAMMING LANGUAGES FOR APPLIED FILTERS
CREATE FUNCTION org_software_languages_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	prog_language TEXT,
	prog_language_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(prog_lang) AS prog_language,
	COUNT(id) AS prog_language_cnt
FROM
	software_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	COALESCE(categories, '{}') @> category_filter
GROUP BY
	prog_language
;
$$;

-- REACTIVE LICENSES FILTER WITH COUNTS FOR SOFTWARE
-- PROVIDES AVAILABLE LICENSES FOR APPLIED FILTERS
CREATE FUNCTION org_software_licenses_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	license VARCHAR,
	license_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(licenses) AS license,
	COUNT(id) AS license_cnt
FROM
	software_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	COALESCE(categories, '{}') @> category_filter
GROUP BY
	license
;
$$;

-- REACTIVE LICENSES FILTER WITH COUNTS FOR SOFTWARE
-- PROVIDES AVAILABLE LICENSES FOR APPLIED FILTERS
CREATE FUNCTION org_software_categories_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	category VARCHAR,
	category_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(categories) AS category,
	-- count per software on unique software id
	COUNT(DISTINCT(id)) AS category_cnt
FROM
	software_by_organisation_search(organisation_id,search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	COALESCE(categories, '{}') @> category_filter
GROUP BY
	category
;
$$;
