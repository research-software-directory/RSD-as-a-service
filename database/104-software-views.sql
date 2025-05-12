-- SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2023 dv4all
-- SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION delete_software(id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
VOLATILE
AS
$$
BEGIN
	IF id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide the ID of the software to delete';
	END IF;

	IF
		(SELECT rolsuper FROM pg_roles WHERE rolname = SESSION_USER) IS DISTINCT FROM TRUE
		AND
		(SELECT CURRENT_SETTING('request.jwt.claims', FALSE)::json->>'role') IS DISTINCT FROM 'rsd_admin'
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to delete this software';
	END IF;

	DELETE FROM category_for_software WHERE category_for_software.software_id = delete_software.id;
	DELETE FROM contributor WHERE contributor.software = delete_software.id;
	DELETE FROM invite_maintainer_for_software WHERE invite_maintainer_for_software.software = delete_software.id;
	DELETE FROM keyword_for_software WHERE keyword_for_software.software = delete_software.id;
	DELETE FROM license_for_software WHERE license_for_software.software = delete_software.id;
	DELETE FROM maintainer_for_software WHERE maintainer_for_software.software = delete_software.id;
	DELETE FROM mention_for_software WHERE mention_for_software.software = delete_software.id;
	DELETE FROM package_manager WHERE package_manager.software = delete_software.id;
	DELETE FROM reference_paper_for_software WHERE reference_paper_for_software.software = delete_software.id;
	DELETE FROM release_version WHERE release_version.release_id = delete_software.id;
	DELETE FROM release WHERE release.software = delete_software.id;
	DELETE FROM repository_url WHERE repository_url.software = delete_software.id;
	DELETE FROM software_for_community WHERE software_for_community.software = delete_software.id;
	DELETE FROM software_for_organisation WHERE software_for_organisation.software = delete_software.id;
	DELETE FROM software_for_project WHERE software_for_project.software = delete_software.id;
	DELETE FROM software_for_software WHERE software_for_software.origin = delete_software.id OR software_for_software.relation = delete_software.id;
	DELETE FROM software_highlight WHERE software_highlight.software = delete_software.id;
	DELETE FROM testimonial WHERE testimonial.software = delete_software.id;

	DELETE FROM software WHERE software.id = delete_software.id;
END
$$;


CREATE FUNCTION reference_papers_to_scrape()
RETURNS TABLE (
	id UUID,
	doi CITEXT,
	openalex_id CITEXT,
	citations_scraped_at TIMESTAMPTZ,
	known_citing_dois CITEXT[]
)
LANGUAGE sql STABLE AS
$$
	SELECT mention.id, mention.doi, mention.openalex_id, mention.citations_scraped_at, ARRAY_REMOVE(ARRAY_AGG(citation.doi), NULL)
	FROM mention
	LEFT JOIN citation_for_mention ON mention.id = citation_for_mention.mention
	LEFT JOIN mention AS citation ON citation_for_mention.citation = citation.id
	WHERE
	-- ONLY items with DOI or OpenAlex id
		(mention.doi IS NOT NULL OR mention.openalex_id IS NOT NULL)
		AND (
			mention.id IN (
				SELECT mention FROM reference_paper_for_software
			)
			OR
			mention.id IN (
				SELECT mention FROM output_for_project
			)
		)
	GROUP BY mention.id
$$;

-- UNIQUE CITATIONS BY SOFTWARE ID
CREATE FUNCTION citation_by_software() RETURNS TABLE (
	software UUID,
	id UUID,
	doi CITEXT,
	url VARCHAR,
	title VARCHAR,
	authors VARCHAR,
	publisher VARCHAR,
	publication_year SMALLINT,
	journal VARCHAR,
	page VARCHAR,
	image_url VARCHAR,
	mention_type mention_type,
	source VARCHAR,
	reference_papers UUID[]
) LANGUAGE sql STABLE AS
$$
SELECT
	reference_paper_for_software.software,
	mention.id,
	mention.doi,
	mention.url,
	mention.title,
	mention.authors,
	mention.publisher,
	mention.publication_year,
	mention.journal,
	mention.page,
	mention.image_url,
	mention.mention_type,
	mention.source,
	ARRAY_AGG(
		reference_paper_for_software.mention
	) AS reference_paper
FROM
	reference_paper_for_software
INNER JOIN
	citation_for_mention ON citation_for_mention.mention = reference_paper_for_software.mention
INNER JOIN
	mention ON mention.id = citation_for_mention.citation
--EXCLUDE reference papers items from citations
WHERE
	mention.id NOT IN (
		SELECT mention FROM reference_paper_for_software
	)
GROUP BY
	reference_paper_for_software.software,
	mention.id
;
$$;

-- UNIQUE MENTIONS & CITATIONS BY SOFTWARE ID
-- UNION will deduplicate exact entries
CREATE FUNCTION mentions_by_software() RETURNS TABLE (
	software UUID,
	id UUID,
	doi CITEXT,
	url VARCHAR,
	title VARCHAR,
	authors VARCHAR,
	publisher VARCHAR,
	publication_year SMALLINT,
	journal VARCHAR,
	page VARCHAR,
	image_url VARCHAR,
	mention_type mention_type,
	source VARCHAR
) LANGUAGE sql STABLE AS
$$
WITH mentions_and_citations AS (
	-- mentions for software
	SELECT
		mention_for_software.software,
		mention.id,
		mention.doi,
		mention.url,
		mention.title,
		mention.authors,
		mention.publisher,
		mention.publication_year,
		mention.journal,
		mention.page,
		mention.image_url,
		mention.mention_type,
		mention.source
	FROM
		mention
	INNER JOIN
		mention_for_software ON mention_for_software.mention = mention.id
	-- does not deduplicate identical entries, but we will do so below with DISTINCT
	-- from scraped citations
	UNION ALL
	-- scraped citations from reference papers
	SELECT
		software,
		id,
		doi,
		url,
		title,
		authors,
		publisher,
		publication_year,
		journal,
		page,
		image_url,
		mention_type,
		source
	FROM
		citation_by_software()
)
SELECT DISTINCT ON (mentions_and_citations.software, mentions_and_citations.id) * FROM mentions_and_citations;
$$;

-- COUNT mentions per software
CREATE FUNCTION count_software_mentions() RETURNS TABLE (software UUID, mention_cnt BIGINT) LANGUAGE sql STABLE AS
$$
	SELECT
		mentions_by_software.software, COUNT(mentions_by_software.id) AS mention_cnt
	FROM
		mentions_by_software()
	GROUP BY
		mentions_by_software.software;
$$;

CREATE MATERIALIZED VIEW count_software_mentions_cached AS SELECT * FROM count_software_mentions();

CREATE UNIQUE INDEX ON count_software_mentions_cached(software);

-- CATEGORIES for software overview filter (GLOBAL)
CREATE FUNCTION software_categories() RETURNS TABLE(
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
	-- FILTER FOR GLOBAL CATEGORIES
		category_path.community IS NULL AND category_path.organisation IS NULL
	GROUP BY
		category_for_software.software_id;
$$;

-- SOFTWARE OVERVIEW LIST
-- WITH COUNTS and KEYWORDS for filtering
-- USED BY remote RSD scraper!
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
	licenses VARCHAR[],
	categories VARCHAR[]
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
	count_software_mentions_cached.mention_cnt,
	software.is_published,
	keyword_filter_for_software.keywords,
	keyword_filter_for_software.keywords_text,
	prog_lang_filter_for_software.prog_lang,
	license_filter_for_software.licenses,
	software_categories.category AS categories
FROM
	software
LEFT JOIN
	count_software_contributors() ON software.id=count_software_contributors.software
LEFT JOIN
	count_software_mentions_cached ON software.id=count_software_mentions_cached.software
LEFT JOIN
	keyword_filter_for_software() ON software.id=keyword_filter_for_software.software
LEFT JOIN
	prog_lang_filter_for_software() ON software.id=prog_lang_filter_for_software.software
LEFT JOIN
	license_filter_for_software() ON software.id=license_filter_for_software.software
LEFT JOIN
	software_categories() ON software.id=software_categories.software
;
$$;

-- HIGHLIGHT OVERVIEW LIST
-- WITH COUNTS and KEYWORDS for filtering
CREATE FUNCTION highlight_overview() RETURNS TABLE (
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
	categories VARCHAR[],
	"position" INT
) LANGUAGE sql STABLE AS
$$
SELECT
	software_overview.id,
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
	software_overview.categories,
	software_highlight.position
FROM
	software_overview()
RIGHT JOIN
	software_highlight ON software_overview.id=software_highlight.software
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
	licenses VARCHAR[],
	categories VARCHAR[]
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
	software_categories.category AS categories
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
LEFT JOIN
	software_categories() ON software.id=software_categories.software
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

-- HIGHLIGHT OVERVIEW LIST FOR SEARCH
-- WITH COUNTS and KEYWORDS for filtering
CREATE FUNCTION highlight_search(search VARCHAR) RETURNS TABLE (
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
	categories VARCHAR[],
	"position" INT
) LANGUAGE sql STABLE AS
$$
SELECT
	software_search.id,
	software_search.slug,
	software_search.brand_name,
	software_search.short_statement,
	software_search.image_id,
	software_search.updated_at,
	software_search.is_published,
	software_search.contributor_cnt,
	software_search.mention_cnt,
	software_search.keywords,
	software_search.keywords_text,
	software_search.prog_lang,
	software_search.licenses,
	software_search.categories,
	software_highlight.position
FROM
	software_search(search)
INNER JOIN
	software_highlight ON software_search.id=software_highlight.software
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
	count_software_mentions_cached.mention_cnt,
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
	count_software_mentions_cached ON software.id=count_software_mentions_cached.software
LEFT JOIN
	keyword_filter_for_software() ON software.id=keyword_filter_for_software.software
LEFT JOIN
	prog_lang_filter_for_software() ON software.id=prog_lang_filter_for_software.software
LEFT JOIN
	license_filter_for_software() ON software.id=license_filter_for_software.software
;
$$;

-- REACTIVE KEYWORD FILTER WITH COUNTS FOR HIGHLIGHTS
-- PROVIDES AVAILABLE KEYWORDS FOR APPLIED FILTERS
CREATE FUNCTION highlight_keywords_filter(
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
	highlight_search(search_filter)
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

-- REACTIVE PROGRAMMING LANGUAGES WITH COUNTS FOR HIGHLIGHTS
-- PROVIDES AVAILABLE PROGRAMMING LANGUAGES FOR APPLIED FILTERS
CREATE FUNCTION highlight_languages_filter(
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
	highlight_search(search_filter)
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

-- REACTIVE LICENSES FILTER WITH COUNTS FOR HIGHLIGHTS
-- PROVIDES AVAILABLE LICENSES FOR APPLIED FILTERS
CREATE FUNCTION highlight_licenses_filter(
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
	highlight_search(search_filter)
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

-- REACTIVE CATEGORIES FILTER WITH COUNTS FOR HIGHLIGHTS
-- PROVIDES AVAILABLE CATEGORIES FOR APPLIED FILTERS
CREATE FUNCTION highlight_category_filter(
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
	COUNT(DISTINCT(id)) AS category_cnt
FROM
	highlight_search(search_filter)
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

-- FILTER SOFTWARE by ORCID or account ID
-- OPT-IN ONLY, uses public_user_profile as filter
-- UNIQUE entries by software.id
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
	orcid VARCHAR,
	account UUID
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
	license_filter_for_software.licenses,
	public_user_profile.orcid,
	public_user_profile.account
FROM
	public_user_profile()
INNER JOIN
	contributor ON (
		public_user_profile.orcid = contributor.orcid
		OR public_user_profile.account = contributor.account
	)
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
	account UUID,
	is_public VARCHAR
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT ON (contributor.id)
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
	public_user_profile.account,
	public_user_profile.is_public
FROM
	contributor
LEFT JOIN
	public_user_profile() ON (
		contributor.orcid = public_user_profile.orcid
		OR
		contributor.account = public_user_profile.account
	)
WHERE
	contributor.software = software_id
;
$$;

-- RELATED SOFTWARE LIST WITH COUNTS
CREATE FUNCTION related_software_for_software(software_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	updated_at TIMESTAMPTZ,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	is_published BOOLEAN
) LANGUAGE sql STABLE AS
$$
	SELECT
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.updated_at,
		count_software_contributors.contributor_cnt,
		count_software_mentions.mention_cnt,
		software.is_published
	FROM
		software
	LEFT JOIN
		count_software_contributors() ON software.id=count_software_contributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	INNER JOIN
		software_for_software ON software.id=software_for_software.relation
	WHERE
		software_for_software.origin = software_id;
$$;

-- RELATED SOFTWARE for PROJECT
-- filter by project_id
CREATE FUNCTION related_software_for_project(project_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	updated_at TIMESTAMPTZ,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	is_published BOOLEAN,
	status relation_status
) LANGUAGE sql STABLE AS
$$
	SELECT
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.updated_at,
		count_software_contributors.contributor_cnt,
		count_software_mentions.mention_cnt,
		software.is_published,
		software_for_project.status
	FROM
		software
	LEFT JOIN
		count_software_contributors() ON software.id=count_software_contributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	INNER JOIN
		software_for_project ON software.id=software_for_project.software
	WHERE
		software_for_project.project=project_id;
$$;

-- SOFTWARE BY MAINTAINER
-- NOTE! one software is shown multiple times in this view
-- we filter this view at least by organisation uuid
CREATE FUNCTION software_by_maintainer(maintainer_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	is_published BOOLEAN,
	image_id VARCHAR,
	updated_at TIMESTAMPTZ,
	contributor_cnt BIGINT,
	mention_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
	SELECT
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.is_published,
		software.image_id,
		software.updated_at,
		count_software_contributors.contributor_cnt,
		count_software_mentions.mention_cnt
	FROM
		software
	LEFT JOIN
		count_software_contributors() ON software.id=count_software_contributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	INNER JOIN
		maintainer_for_software ON software.id=maintainer_for_software.software
	WHERE
		maintainer_for_software.maintainer=maintainer_id;
$$;
