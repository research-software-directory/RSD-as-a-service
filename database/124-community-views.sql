-- SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- Software count by community
CREATE FUNCTION software_count_by_community() RETURNS TABLE (
	community UUID,
	software_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT
	community.id,
	COUNT(software_for_community.software) AS software_cnt
FROM
	community
LEFT JOIN
	software_for_community ON community.id = software_for_community.community
GROUP BY
	community.id
;
$$;


-- Keywords with the count used by
-- by search to show existing keywords with the count
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
-- incl. software count and keyword list (for card)
CREATE FUNCTION communities_overview() RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	name VARCHAR,
	short_description VARCHAR,
	logo_id VARCHAR,
	primary_maintainer UUID,
	software_cnt BIGINT,
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
	keyword_filter_for_community.keywords,
	community.description,
	community.created_at
FROM
	community
LEFT JOIN
	software_count_by_community() ON community.id = software_count_by_community.community
LEFT JOIN
	keyword_filter_for_community() ON community.id=keyword_filter_for_community.community
;
$$;
