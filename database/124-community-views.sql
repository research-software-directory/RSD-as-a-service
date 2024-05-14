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

