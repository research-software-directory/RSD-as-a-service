-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

-- SOFTWARE OVERVIEW LIST
-- WITH COUNTS and KEYWORDS for filtering
CREATE FUNCTION software_overview() RETURNS TABLE (
	id UUID,
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
	licenses VARCHAR[]
) LANGUAGE sql STABLE AS
$$
SELECT
	software.id,
	software.slug,
	software.brand_name,
	software.short_statement,
	software.image_id,
	software.updated_at,
	count_software_contributors.contributor_cnt,
	count_software_mentions.mention_cnt,
	software.is_published,
	keyword_filter_for_software.keywords,
	keyword_filter_for_software.keywords_text,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses
FROM
	software
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
;
$$;


-- SOFTWARE OVERVIEW LIST FOR SEARCH
-- WITH COUNTS and KEYWORDS for filtering
CREATE FUNCTION software_search(search VARCHAR) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	image_id VARCHAR,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	keywords CITEXT[],
	keywords_text TEXT,
	prog_lang TEXT[],
	licenses VARCHAR[]
) LANGUAGE sql STABLE AS
$$
SELECT
	software.id,
	software.slug,
	software.brand_name,
	software.short_statement,
	software.image_id,
	software.updated_at,
	software.is_published,
	count_software_contributors.contributor_cnt,
	count_software_mentions.mention_cnt,
	keyword_filter_for_software.keywords,
	keyword_filter_for_software.keywords_text,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses
FROM
	software
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
WHERE
	software.brand_name ILIKE CONCAT('%', search, '%')
	OR
	software.slug ILIKE CONCAT('%', search, '%')
	OR
	software.short_statement ILIKE CONCAT('%', search, '%')
	OR
	keyword_filter_for_software.keywords_text ILIKE CONCAT('%', search, '%')
ORDER BY
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


-- Get a list of all software highlights
CREATE FUNCTION software_for_highlight() RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	image_id VARCHAR,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	keywords CITEXT[],
	keywords_text TEXT,
	prog_lang TEXT[],
	licenses VARCHAR[],
	"position" INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	software.id,
	software.slug,
	software.brand_name,
	software.short_statement,
	software.image_id,
	software.updated_at,
	software.is_published,
	count_software_contributors.contributor_cnt,
	count_software_mentions.mention_cnt,
	keyword_filter_for_software.keywords,
	keyword_filter_for_software.keywords_text,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses,
	software_highlight.position
FROM
	software
INNER JOIN
	software_highlight ON software.id=software_highlight.software
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
;
$$;


-- REACTIVE KEYWORD FILTER WITH COUNTS FOR SOFTWARE
-- PROVIDES AVAILABLE KEYWORDS FOR APPLIED FILTERS
CREATE FUNCTION software_keywords_filter(
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
	software_search(search_filter)
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
CREATE FUNCTION software_languages_filter(
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
	software_search(search_filter)
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
CREATE FUNCTION software_licenses_filter(
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
	software_search(search_filter)
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

-- FILTER SOFTWARE by orcid
-- OPT-IN ONLY, uses public_profile table as filter
-- UNIQUE entries by ORCID & software.id
CREATE FUNCTION software_by_public_profile() RETURNS TABLE (
	id UUID,
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
	orcid VARCHAR
) LANGUAGE sql STABLE AS
$$
SELECT
	DISTINCT ON (software.id,public_profile.orcid)
	software.id,
	software.slug,
	software.brand_name,
	software.short_statement,
	software.image_id,
	software.updated_at,
	count_software_contributors.contributor_cnt,
	count_software_mentions.mention_cnt,
	software.is_published,
	keyword_filter_for_software.keywords,
	keyword_filter_for_software.keywords_text,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses,
	public_profile.orcid
FROM
	public_profile()
INNER JOIN
	contributor ON public_profile.orcid = contributor.orcid
LEFT JOIN
	software ON software.id = contributor.software
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
;
$$;

-- contributors for software
-- public_profile.orcid indicates public profile OPT-IN
CREATE FUNCTION software_contributors(software_id UUID) RETURNS TABLE (
	id UUID,
	is_contact_person BOOLEAN,
	email_address VARCHAR,
	family_names VARCHAR,
	given_names VARCHAR,
	affiliation VARCHAR,
	role VARCHAR,
	orcid VARCHAR,
	avatar_id VARCHAR,
	"position" INT,
	software UUID,
	public_orcid_profile VARCHAR
) LANGUAGE sql STABLE AS
$$
SELECT
	contributor.id,
	contributor.is_contact_person,
	contributor.email_address,
	contributor.family_names,
	contributor.given_names,
	contributor.affiliation,
	contributor.role,
	contributor.orcid,
	contributor.avatar_id,
	contributor."position",
	contributor.software,
	public_profile.orcid as public_orcid_profile
FROM
	contributor
LEFT JOIN
	public_profile() ON contributor.orcid = public_profile.orcid
WHERE
	contributor.software = software_id
;
$$;
