-- SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- RPC AGGREGATED SOFTWARE VIEWS
-- DEPENDS ON: software_overview, remote_software
CREATE FUNCTION aggregated_software_overview() RETURNS TABLE (
	id UUID,
	rsd_host VARCHAR,
	domain VARCHAR,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	image_id VARCHAR,
	updated_at TIMESTAMPTZ,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	is_published BOOLEAN,
	keywords CITEXT[],
	keywords_text TEXT,
	prog_lang TEXT[],
	licenses VARCHAR[],
	categories VARCHAR[]
) LANGUAGE sql STABLE AS
$$
SELECT
	software_overview.id,
	COALESCE((SELECT value FROM rsd_info WHERE KEY='remote_name'),NULL) AS rsd_host,
	NULL AS domain,
	software_overview.slug,
	software_overview.brand_name,
	software_overview.short_statement,
	software_overview.image_id,
	software_overview.updated_at,
	software_overview.contributor_cnt,
	software_overview.mention_cnt,
	software_overview.is_published,
	software_overview.keywords,
	software_overview.keywords_text,
	software_overview.prog_lang,
	software_overview.licenses,
	software_overview.categories
FROM
	software_overview()
UNION ALL
SELECT
	remote_software.id,
	remote_rsd.label AS rsd_host,
	remote_rsd.domain,
	remote_software.slug,
	remote_software.brand_name,
	remote_software.short_statement,
	remote_software.image_id,
	remote_software.updated_at,
	remote_software.contributor_cnt,
	remote_software.mention_cnt,
	remote_software.is_published,
	remote_software.keywords,
	remote_software.keywords_text,
	remote_software.prog_lang,
	remote_software.licenses,
	--	WE DO NOT USE/SCRAPE categories from remotes
	'{}' AS categories
FROM
	remote_software
INNER JOIN
	remote_rsd ON remote_rsd.id = remote_software.remote_rsd_id
;
$$;

-- AGGREGATES SOFTWARE OVERVIEW LIST FOR SEARCH
-- DEPENDS ON: aggregated_software_overview
CREATE FUNCTION aggregated_software_search(search VARCHAR) RETURNS TABLE (
	id UUID,
	rsd_host VARCHAR,
	domain VARCHAR,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	image_id VARCHAR,
	updated_at TIMESTAMPTZ,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	is_published BOOLEAN,
	keywords CITEXT[],
	keywords_text TEXT,
	prog_lang TEXT[],
	licenses VARCHAR[],
	categories VARCHAR[]
) LANGUAGE sql STABLE AS
$$
SELECT
	id, rsd_host, domain, slug, brand_name, short_statement, image_id,
	updated_at, contributor_cnt, mention_cnt, is_published, keywords,
	keywords_text, prog_lang, licenses, categories
FROM
	aggregated_software_overview()
WHERE
	aggregated_software_overview.brand_name ILIKE CONCAT('%', search, '%')
	OR
	aggregated_software_overview.slug ILIKE CONCAT('%', search, '%')
	OR
	aggregated_software_overview.short_statement ILIKE CONCAT('%', search, '%')
	OR
	aggregated_software_overview.keywords_text ILIKE CONCAT('%', search, '%')
ORDER BY
	CASE
		WHEN aggregated_software_overview.brand_name ILIKE search THEN 0
		WHEN aggregated_software_overview.brand_name ILIKE CONCAT(search, '%') THEN 1
		WHEN aggregated_software_overview.brand_name ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END,
	CASE
		WHEN aggregated_software_overview.slug ILIKE search THEN 0
		WHEN aggregated_software_overview.slug ILIKE CONCAT(search, '%') THEN 1
		WHEN aggregated_software_overview.slug ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END,
	CASE
		WHEN aggregated_software_overview.short_statement ILIKE search THEN 0
		WHEN aggregated_software_overview.short_statement ILIKE CONCAT(search, '%') THEN 1
		WHEN aggregated_software_overview.short_statement ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END
;
$$;

-- REACTIVE KEYWORD FILTER WITH COUNTS FOR SOFTWARE
-- DEPENDS ON: aggregated_software_search
CREATE FUNCTION aggregated_software_keywords_filter(
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}',
	rsd_host_filter VARCHAR DEFAULT ''
) RETURNS TABLE (
	keyword CITEXT,
	keyword_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(keywords) AS keyword,
	COUNT(id) AS keyword_cnt
FROM
	aggregated_software_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	CASE WHEN COALESCE(category_filter, '{}') = '{}' THEN TRUE ELSE COALESCE(categories, '{}') @> category_filter END
	AND
		CASE
			WHEN rsd_host_filter = '' THEN TRUE
			WHEN rsd_host_filter IS NULL THEN rsd_host IS NULL
		ELSE
			rsd_host = rsd_host_filter
		END
GROUP BY
	keyword
;
$$;

-- REACTIVE PROGRAMMING LANGUAGES WITH COUNTS FOR SOFTWARE
-- DEPENDS ON: aggregated_software_search
CREATE FUNCTION aggregated_software_languages_filter(
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}',
	rsd_host_filter VARCHAR DEFAULT ''
) RETURNS TABLE (
	prog_language TEXT,
	prog_language_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(prog_lang) AS prog_language,
	COUNT(id) AS prog_language_cnt
FROM
	aggregated_software_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	CASE WHEN COALESCE(category_filter, '{}') = '{}' THEN TRUE ELSE COALESCE(categories, '{}') @> category_filter END
	AND
		CASE
			WHEN rsd_host_filter = '' THEN TRUE
			WHEN rsd_host_filter IS NULL THEN rsd_host IS NULL
		ELSE
			rsd_host = rsd_host_filter
		END
GROUP BY
	prog_language
;
$$;

-- REACTIVE LICENSES FILTER WITH COUNTS FOR SOFTWARE
-- DEPENDS ON: aggregated_software_search
CREATE FUNCTION aggregated_software_licenses_filter(
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}',
	rsd_host_filter VARCHAR DEFAULT ''
) RETURNS TABLE (
	license VARCHAR,
	license_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(licenses) AS license,
	COUNT(id) AS license_cnt
FROM
	aggregated_software_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	CASE WHEN COALESCE(category_filter, '{}') = '{}' THEN TRUE ELSE COALESCE(categories, '{}') @> category_filter END
	AND
		CASE
			WHEN rsd_host_filter = '' THEN TRUE
			WHEN rsd_host_filter IS NULL THEN rsd_host IS NULL
		ELSE
			rsd_host = rsd_host_filter
		END
GROUP BY
	license
;
$$;

-- REACTIVE CATEGORIES FILTER WITH COUNTS FOR SOFTWARE
-- DEPENDS ON: aggregated_software_search
CREATE FUNCTION aggregated_software_categories_filter(
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}',
	rsd_host_filter VARCHAR DEFAULT ''
) RETURNS TABLE (
	category VARCHAR,
	category_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(categories) AS category,
	COUNT(DISTINCT(id)) AS category_cnt
FROM
	aggregated_software_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	COALESCE(categories, '{}') @> category_filter
	AND
		CASE
			WHEN rsd_host_filter = '' THEN TRUE
			WHEN rsd_host_filter IS NULL THEN rsd_host IS NULL
		ELSE
			rsd_host = rsd_host_filter
		END
GROUP BY
	category
;
$$;

-- REACTIVE SOURCE FILTER WITH COUNTS FOR SOFTWARE
-- DEPENDS ON: aggregated_software_search
CREATE FUNCTION aggregated_software_hosts_filter(
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	prog_lang_filter TEXT[] DEFAULT '{}',
	license_filter VARCHAR[] DEFAULT '{}',
	category_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	rsd_host VARCHAR,
	rsd_host_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	rsd_host,
	COUNT(id) AS rsd_host_cnt
FROM
	aggregated_software_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
	AND
	CASE WHEN COALESCE(category_filter, '{}') = '{}' THEN TRUE ELSE COALESCE(categories, '{}') @> category_filter END
GROUP BY
	rsd_host
;
$$;
