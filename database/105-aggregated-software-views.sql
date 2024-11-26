-- SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- RPC AGGREGATED SOFTWARE VIEWS
-- DEPENDS ON: software_overview, remote_software
CREATE FUNCTION aggregated_software_overview() RETURNS TABLE (
	id UUID,
	source VARCHAR,
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
	licenses VARCHAR[]
) LANGUAGE sql STABLE AS
$$
SELECT
	software_overview.id,
	NULL AS source,
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
	software_overview.licenses
FROM
	software_overview()
UNION
SELECT
	remote_software.id,
	remote_rsd.label AS source,
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
	remote_software.licenses
FROM
	remote_software
INNER JOIN
	remote_rsd ON remote_rsd.id=remote_software.remote_rsd
;
$$;

-- AGGREGATES SOFTWARE OVERVIEW LIST FOR SEARCH
-- DEPENDS ON: aggregated_software_overview
CREATE FUNCTION aggregated_software_search(search VARCHAR) RETURNS TABLE (
	id UUID,
	source VARCHAR,
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
	licenses VARCHAR[]
) LANGUAGE sql STABLE AS
$$
SELECT
	id, source, domain, slug, brand_name, short_statement, image_id,
	updated_at, contributor_cnt, mention_cnt, is_published, keywords,
	keywords_text, prog_lang, licenses
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
