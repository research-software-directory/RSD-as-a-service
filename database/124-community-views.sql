-- SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- Software count by community
-- BY DEFAULT we return count of approved software
-- IF public is FALSE we return approved software that is not published too
CREATE FUNCTION software_count_by_community(public BOOLEAN DEFAULT TRUE) RETURNS TABLE (
	community UUID,
	software_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT
	software_for_community.community,
	COUNT(DISTINCT software_for_community.software) AS software_cnt
FROM
	software_for_community
WHERE
	software_for_community.status = 'approved' AND (
		NOT public OR software IN (SELECT id FROM software WHERE is_published)
	)
GROUP BY
	software_for_community.community
;
$$;

-- Pending software count by community
-- BY DEFAULT we return count of approved software
-- IF public is FALSE we return total count (as far as RLS allows)
CREATE FUNCTION pending_count_by_community() RETURNS TABLE (
	community UUID,
	pending_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT
	software_for_community.community,
	COUNT(DISTINCT software_for_community.software) AS pending_cnt
FROM
	software_for_community
WHERE
	software_for_community.status = 'pending'
GROUP BY
	software_for_community.community
;
$$;

-- Rejected software count by community
-- BY DEFAULT we return count of approved software
-- IF public is FALSE we return total count (as far as RLS allows)
CREATE FUNCTION rejected_count_by_community() RETURNS TABLE (
	community UUID,
	rejected_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT
	software_for_community.community,
	COUNT(DISTINCT software_for_community.software) AS rejected_cnt
FROM
	software_for_community
WHERE
	software_for_community.status = 'rejected'
GROUP BY
	software_for_community.community
;
$$;

-- Keywords with the count used by keyword settings
-- to show existing keywords with the count
CREATE FUNCTION keyword_count_for_community() RETURNS TABLE (
	id UUID,
	keyword CITEXT,
	cnt BIGINT
) LANGUAGE sql STABLE AS
$$
	SELECT
		keyword.id,
		keyword.value AS keyword,
		keyword_count.cnt
	FROM
		keyword
	LEFT JOIN
		(SELECT
				keyword_for_community.keyword,
				COUNT(keyword_for_community.keyword) AS cnt
			FROM
				keyword_for_community
			GROUP BY keyword_for_community.keyword
		) AS keyword_count ON keyword.id = keyword_count.keyword;
$$;

-- Keywords by community
-- for editing keywords of specific community
CREATE FUNCTION keywords_by_community() RETURNS TABLE (
	id UUID,
	keyword CITEXT,
	community UUID
) LANGUAGE sql STABLE AS
$$
	SELECT
		keyword.id,
		keyword.value AS keyword,
		keyword_for_community.community
	FROM
		keyword_for_community
	INNER JOIN
		keyword ON keyword.id = keyword_for_community.keyword;
$$;
-- using filter ?community=eq.UUID

-- Keywords grouped by community for filtering
-- We use array for selecting community with specific keywords
-- We use text value for "wild card" search
CREATE FUNCTION keyword_filter_for_community() RETURNS TABLE (
	community UUID,
	keywords CITEXT[],
	keywords_text TEXT
) LANGUAGE sql STABLE AS
$$
	SELECT
		keyword_for_community.community AS community,
		ARRAY_AGG(
			keyword.value
			ORDER BY value
		) AS keywords,
		STRING_AGG(
			keyword.value,' '
			ORDER BY value
		) AS keywords_text
	FROM
		keyword_for_community
	INNER JOIN
		keyword ON keyword.id = keyword_for_community.keyword
	GROUP BY keyword_for_community.community;
$$;


-- rpc for community overview page
-- BY DEFAULT we return count of approved software
-- IF public is FALSE we return total count (as far as RLS allows)
CREATE FUNCTION communities_overview(public BOOLEAN DEFAULT TRUE) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	name VARCHAR,
	short_description VARCHAR,
	logo_id VARCHAR,
	primary_maintainer UUID,
	software_cnt BIGINT,
	pending_cnt BIGINT,
	rejected_cnt BIGINT,
	keywords CITEXT[],
	description VARCHAR,
	created_at TIMESTAMPTZ
) LANGUAGE sql STABLE AS
$$
SELECT
	community.id,
	community.slug,
	community."name",
	community.short_description,
	community.logo_id,
	community.primary_maintainer,
	software_count_by_community.software_cnt,
	pending_count_by_community.pending_cnt,
	rejected_count_by_community.rejected_cnt,
	keyword_filter_for_community.keywords,
	community.description,
	community.created_at
FROM
	community
LEFT JOIN
	software_count_by_community(public) ON community.id = software_count_by_community.community
LEFT JOIN
	pending_count_by_community() ON community.id = pending_count_by_community.community
LEFT JOIN
	rejected_count_by_community() ON community.id = rejected_count_by_community.community
LEFT JOIN
	keyword_filter_for_community() ON community.id=keyword_filter_for_community.community
;
$$;


-- SOFTWARE info by community
-- we filter this view at least by community_id (uuid)
CREATE FUNCTION software_by_community(community_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	image_id VARCHAR,
	is_published BOOLEAN,
	updated_at TIMESTAMPTZ,
	status request_status,
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
	software_for_community.status,
	keyword_filter_for_software.keywords,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses,
	count_software_contributors.contributor_cnt,
	count_software_mentions.mention_cnt
FROM
	software
LEFT JOIN
	software_for_community ON software.id=software_for_community.software
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
	software_for_community.community = community_id
;
$$;


-- SOFTWARE OF COMMUNITY LIST FOR SEARCH
-- WITH keywords, programming languages and licenses for filtering
CREATE FUNCTION software_by_community_search(
	community_id UUID,
	search VARCHAR
) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	image_id VARCHAR,
	is_published BOOLEAN,
	updated_at TIMESTAMPTZ,
	status request_status,
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
	software_for_community.status,
	keyword_filter_for_software.keywords,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses,
	count_software_contributors.contributor_cnt,
	count_software_mentions.mention_cnt
FROM
	software
LEFT JOIN
	software_for_community ON software.id=software_for_community.software
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
	software_for_community.community = community_id AND (
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
CREATE FUNCTION com_software_keywords_filter(
	community_id UUID,
	software_status request_status DEFAULT 'approved',
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
	software_by_community_search(community_id,search_filter)
WHERE
	software_by_community_search.status = software_status
	AND
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
CREATE FUNCTION com_software_languages_filter(
	community_id UUID,
	software_status request_status DEFAULT 'approved',
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
	software_by_community_search(community_id,search_filter)
WHERE
	software_by_community_search.status = software_status
	AND
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
CREATE FUNCTION com_software_licenses_filter(
	community_id UUID,
	software_status request_status DEFAULT 'approved',
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
	software_by_community_search(community_id,search_filter)
WHERE
	software_by_community_search.status = software_status
	AND
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(prog_lang, '{}') @> prog_lang_filter
	AND
	COALESCE(licenses, '{}') @> license_filter
GROUP BY
	license
;
$$;
