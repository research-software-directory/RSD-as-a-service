-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

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
	impact_cnt INTEGER,
	output_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
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
	COALESCE(count_project_impact.impact_cnt, 0) AS impact_cnt,
	COALESCE(count_project_output.output_cnt, 0) AS output_cnt
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
	count_project_impact() ON project.id = count_project_impact.project
LEFT JOIN
	count_project_output() ON project.id = count_project_output.project
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
	impact_cnt INTEGER,
	output_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
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
	COALESCE(count_project_impact.impact_cnt, 0) AS impact_cnt,
	COALESCE(count_project_output.output_cnt, 0) AS output_cnt
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
	count_project_impact() ON project.id = count_project_impact.project
LEFT JOIN
	count_project_output() ON project.id = count_project_output.project
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
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}'
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
GROUP BY
	keyword
;
$$;


-- REACTIVE RESEARCH DOMAIN FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE DOMAINS FOR APPLIED FILTERS
CREATE FUNCTION org_project_domains_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}'
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
GROUP BY
	domain
;
$$;


-- REACTIVE PARTICIPATING ORGANISATIONS FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE DOMAINS FOR APPLIED FILTERS
CREATE FUNCTION org_project_participating_organisations_filter(
	organisation_id UUID,
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}'
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
GROUP BY
	organisation
;
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
	count_software_countributors.contributor_cnt,
	count_software_mentions.mention_cnt
FROM
	software
LEFT JOIN
	software_for_organisation ON software.id=software_for_organisation.software
LEFT JOIN
	count_software_countributors() ON software.id=count_software_countributors.software
LEFT JOIN
	count_software_mentions() ON software.id=count_software_mentions.software
LEFT JOIN
	keyword_filter_for_software() ON software.id=keyword_filter_for_software.software
LEFT JOIN
	prog_lang_filter_for_software() ON software.id=prog_lang_filter_for_software.software
LEFT JOIN
	license_filter_for_software() ON software.id=license_filter_for_software.software
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
	count_software_countributors.contributor_cnt,
	count_software_mentions.mention_cnt
FROM
	software
LEFT JOIN
	software_for_organisation ON software.id=software_for_organisation.software
LEFT JOIN
	count_software_countributors() ON software.id=count_software_countributors.software
LEFT JOIN
	count_software_mentions() ON software.id=count_software_mentions.software
LEFT JOIN
	keyword_filter_for_software() ON software.id=keyword_filter_for_software.software
LEFT JOIN
	prog_lang_filter_for_software() ON software.id=prog_lang_filter_for_software.software
LEFT JOIN
	license_filter_for_software() ON software.id=license_filter_for_software.software
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
	license_filter VARCHAR[] DEFAULT '{}'
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
	license_filter VARCHAR[] DEFAULT '{}'
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
	license_filter VARCHAR[] DEFAULT '{}'
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
GROUP BY
	license
;
$$;
