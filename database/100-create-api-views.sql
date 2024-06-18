-- SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2021 - 2023 dv4all
-- SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
-- SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
--
-- SPDX-License-Identifier: Apache-2.0

-- NOTE1: Moved views to (stable) functions because views do not allow for RLS (row-level-security)
-- SEE issue https://github.com/research-software-directory/RSD-as-a-service/issues/170

-- NOTE2: After creating new function you might need to reload postgREST to be able to access the function

-- Keywords with the count used in software
-- used by search to show existing keywords with the count
CREATE FUNCTION keyword_count_for_software() RETURNS TABLE (
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
				keyword_for_software.keyword,
				COUNT(keyword_for_software.keyword) AS cnt
			FROM
				keyword_for_software
			GROUP BY keyword_for_software.keyword
		) AS keyword_count ON keyword.id = keyword_count.keyword;
$$;

-- Keywords by software
-- for selecting keywords of specific software
-- using filter ?software=eq.UUID
CREATE FUNCTION keywords_by_software() RETURNS TABLE (
	id UUID,
	keyword CITEXT,
	software UUID
) LANGUAGE sql STABLE AS
$$
	SELECT
		keyword.id,
		keyword.value AS keyword,
		keyword_for_software.software
	FROM
		keyword_for_software
	INNER JOIN
		keyword ON keyword.id = keyword_for_software.keyword;
$$;

-- Keywords grouped by software for filtering
-- We use array for selecting software with specific keywords
-- We use text value for "wild card" search
CREATE FUNCTION keyword_filter_for_software() RETURNS TABLE (
	software UUID,
	keywords CITEXT[],
	keywords_text TEXT
) LANGUAGE sql STABLE AS
$$
	SELECT
		keyword_for_software.software AS software,
		ARRAY_AGG(
			keyword.value
			ORDER BY value
		) AS keywords,
		STRING_AGG(
			keyword.value,' '
			ORDER BY value
		) AS keywords_text
	FROM
		keyword_for_software
	INNER JOIN
		keyword ON keyword.id = keyword_for_software.keyword
	GROUP BY keyword_for_software.software;
$$;

-- COUNT contributors per software
CREATE FUNCTION count_software_contributors() RETURNS TABLE (software UUID, contributor_cnt BIGINT) LANGUAGE sql STABLE AS
$$
SELECT
		contributor.software, COUNT(contributor.id) AS contributor_cnt
	FROM
		contributor
	GROUP BY
		contributor.software;
$$;

-- programming language filter for software
-- used by software_overview func
CREATE FUNCTION prog_lang_filter_for_software() RETURNS TABLE (
	software UUID,
	prog_lang TEXT[]
) LANGUAGE sql STABLE AS
$$
	SELECT
		repository_url.software,
		(SELECT
			ARRAY_AGG(p_lang ORDER BY repository_url.languages -> p_lang DESC)
		FROM
			JSONB_OBJECT_KEYS(repository_url.languages) p_lang
		) AS "prog_lang"
	FROM
		repository_url;
$$;

-- license filter for software
-- used by software_search func
CREATE FUNCTION license_filter_for_software() RETURNS TABLE (
	software UUID,
	licenses VARCHAR[]
) LANGUAGE sql STABLE AS
$$
SELECT
	license_for_software.software,
	ARRAY_AGG(license_for_software.license)
FROM
	license_for_software
GROUP BY
	license_for_software.software
;
$$;

-- Software maintainer by software slug
CREATE FUNCTION maintainer_for_software_by_slug() RETURNS TABLE (maintainer UUID, software UUID, slug VARCHAR) LANGUAGE sql STABLE AS
$$
	SELECT
		maintainer_for_software.maintainer, maintainer_for_software.software, software.slug
	FROM
		maintainer_for_software
	LEFT JOIN
		software ON software.id = maintainer_for_software.software;
$$;

-- Participating organisations by software
-- requires software UUID
CREATE FUNCTION organisations_of_software(software_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	primary_maintainer UUID,
	name VARCHAR,
	ror_id VARCHAR,
	is_tenant BOOLEAN,
	website VARCHAR,
	rsd_path VARCHAR,
	logo_id VARCHAR,
	status relation_status,
	"position" INTEGER,
	software UUID
) LANGUAGE sql STABLE AS
$$
	SELECT
		organisation.id AS id,
		organisation.slug,
		organisation.primary_maintainer,
		organisation.name,
		organisation.ror_id,
		organisation.is_tenant,
		organisation.website,
		organisation_route.rsd_path,
		organisation.logo_id,
		software_for_organisation.status,
		software_for_organisation.position,
		software.id AS software
	FROM
		software
	INNER JOIN
		software_for_organisation ON software.id = software_for_organisation.software
	INNER JOIN
		organisation ON software_for_organisation.organisation = organisation.id
	LEFT JOIN
		organisation_route(organisation.id) ON organisation_route.organisation = organisation.id
	WHERE
		software.id = software_id;
$$;

-- Software count by organisation
-- BY DEFAULT we return count of approved software
-- IF public is FALSE we return total count (as far as RLS allows)
CREATE FUNCTION software_count_by_organisation(public BOOLEAN DEFAULT TRUE) RETURNS TABLE (
	organisation UUID,
	software_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT
	list_parent_organisations.organisation_id,
	COUNT(DISTINCT software_for_organisation.software) AS software_cnt
FROM
	software_for_organisation
CROSS JOIN list_parent_organisations(software_for_organisation.organisation)
WHERE
		(NOT public)
	OR
		(
			software_for_organisation.status = 'approved'
		AND
			software IN (SELECT id FROM software WHERE is_published)
		)
GROUP BY list_parent_organisations.organisation_id;
$$;

-- Project count by organisation
-- BY DEFAULT we return count of approved projects
-- IF public is FALSE we return total count (as far as RLS allows)
CREATE FUNCTION project_count_by_organisation(public BOOLEAN DEFAULT TRUE) RETURNS TABLE (
	organisation UUID,
	project_cnt BIGINT
)LANGUAGE sql STABLE AS
$$
SELECT
	list_parent_organisations.organisation_id,
	COUNT(DISTINCT project_for_organisation.project) AS project_cnt
FROM
	project_for_organisation
CROSS JOIN list_parent_organisations(project_for_organisation.organisation)
WHERE
		(NOT public)
	OR
		(
			status = 'approved'
		AND
			project IN (SELECT id FROM project WHERE is_published)
		)
GROUP BY list_parent_organisations.organisation_id;
$$;

-- Direct children count by organisation
CREATE FUNCTION children_count_by_organisation() RETURNS TABLE (
	parent UUID,
	children_cnt BIGINT
)LANGUAGE sql STABLE AS
$$
SELECT
	organisation.parent, COUNT(*) AS children_cnt
FROM
	organisation
WHERE
	organisation.parent IS NOT NULL
GROUP BY
	organisation.parent
;
$$;

-- Software releases by organisation
-- release info is scraped from concept DOI
-- one software belongs to multiple organisations
-- INCLUDES releases of children organisations
CREATE FUNCTION releases_by_organisation() RETURNS TABLE (
	organisation_id UUID,
	software_id UUID,
	software_slug VARCHAR,
	software_name VARCHAR,
	release_doi CITEXT,
	release_tag VARCHAR,
	release_date TIMESTAMPTZ,
	release_year SMALLINT,
	release_authors VARCHAR
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT
	organisation.id AS organisation_id,
	software.id AS software_id,
	software.slug AS software_slug,
	software.brand_name AS software_name,
	mention.doi AS release_doi,
	mention.version AS release_tag,
	mention.doi_registration_date AS release_date,
	mention.publication_year AS release_year,
	mention.authors AS release_authors
FROM
	organisation
CROSS JOIN
	list_child_organisations(organisation.id)
INNER JOIN
	software_for_organisation ON list_child_organisations.organisation_id = software_for_organisation.organisation
INNER JOIN
	software ON software.id = software_for_organisation.software
INNER JOIN
	"release" ON "release".software = software.id
INNER JOIN
	release_version ON release_version.release_id = "release".software
INNER JOIN
	mention ON mention.id = release_version.mention_id
;
$$;

-- Software releases count by organisation
-- DEPENDS ON releases_by_organisation RPC
CREATE FUNCTION release_cnt_by_organisation() RETURNS TABLE (
	organisation_id UUID,
	release_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT
	releases_by_organisation.organisation_id AS organisation_id,
	COUNT(releases_by_organisation.*) AS release_cnt
FROM
	organisation
INNER JOIN
	releases_by_organisation() ON releases_by_organisation.organisation_id = organisation.id
GROUP BY
	releases_by_organisation.organisation_id
;
$$;

-- Software releases count per YEAR by organisation
-- DEPENDS ON releases_by_organisation RPC
CREATE FUNCTION release_cnt_by_year(organisation_id UUID) RETURNS TABLE (
	release_year SMALLINT,
	release_cnt BIGINT
) LANGUAGE sql STABLE AS
$$
	SELECT
		releases_by_organisation.release_year,
		COUNT(releases_by_organisation.*) AS release_cnt
	FROM
		releases_by_organisation()
	WHERE
		releases_by_organisation.organisation_id = release_cnt_by_year.organisation_id
	GROUP BY
		releases_by_organisation.release_year;
$$;

-- Organisations overview
-- we pass public param to count functions to get public/private count
-- public count is default,
-- note! the RLS will limit row selection in any case
CREATE FUNCTION organisations_overview(public BOOLEAN DEFAULT TRUE) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	parent UUID,
	primary_maintainer UUID,
	name VARCHAR,
	short_description VARCHAR,
	country VARCHAR,
	ror_id VARCHAR,
	website VARCHAR,
	is_tenant BOOLEAN,
	rsd_path VARCHAR,
	parent_names VARCHAR,
	logo_id VARCHAR,
	software_cnt BIGINT,
	project_cnt BIGINT,
	children_cnt BIGINT,
	release_cnt BIGINT,
	score BIGINT
) LANGUAGE sql STABLE AS
$$
SELECT
	organisation.id,
	organisation.slug,
	organisation.parent,
	organisation.primary_maintainer,
	organisation.name,
	organisation.short_description,
	organisation.country,
	organisation.ror_id,
	organisation.website,
	organisation.is_tenant,
	organisation_route.rsd_path,
	organisation_route.parent_names,
	organisation.logo_id,
	software_count_by_organisation.software_cnt,
	project_count_by_organisation.project_cnt,
	children_count_by_organisation.children_cnt,
	release_cnt_by_organisation.release_cnt,
	(
		COALESCE(software_count_by_organisation.software_cnt,0) +
		COALESCE(project_count_by_organisation.project_cnt,0)
	) as score
FROM
	organisation
LEFT JOIN
	organisation_route(organisation.id) ON organisation_route.organisation = organisation.id
LEFT JOIN
	software_count_by_organisation(public) ON software_count_by_organisation.organisation = organisation.id
LEFT JOIN
	project_count_by_organisation(public) ON project_count_by_organisation.organisation = organisation.id
LEFT JOIN
	children_count_by_organisation() ON children_count_by_organisation.parent = organisation.id
LEFT JOIN
	release_cnt_by_organisation() ON release_cnt_by_organisation.organisation_id = organisation.id
;
$$;

-- Participating organisations by project
-- we filter this view by project_id UUID
CREATE FUNCTION organisations_of_project(project_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	primary_maintainer UUID,
	name VARCHAR,
	ror_id VARCHAR,
	is_tenant BOOLEAN,
	website VARCHAR,
	rsd_path VARCHAR,
	logo_id VARCHAR,
	status relation_status,
	role organisation_role,
	"position" INTEGER,
	project UUID,
	parent UUID
) LANGUAGE sql STABLE AS
$$
	SELECT
			organisation.id AS id,
			organisation.slug,
			organisation.primary_maintainer,
			organisation.name,
			organisation.ror_id,
			organisation.is_tenant,
			organisation.website,
			organisation_route.rsd_path,
			organisation.logo_id,
			project_for_organisation.status,
			project_for_organisation.role,
			project_for_organisation.position,
			project.id AS project,
			organisation.parent
	FROM
		project
	INNER JOIN
		project_for_organisation ON project.id = project_for_organisation.project
	INNER JOIN
		organisation ON project_for_organisation.organisation = organisation.id
	LEFT JOIN
		organisation_route(organisation.id) ON organisation_route.organisation = organisation.id
	WHERE
		project.id = project_id;
$$;

-- Project maintainer by slug
-- there are similar functions for software maintainers
CREATE FUNCTION maintainer_for_project_by_slug() RETURNS TABLE (
	maintainer UUID,
	project UUID,
	slug VARCHAR
) LANGUAGE sql STABLE AS
$$
	SELECT
		maintainer_for_project.maintainer,
		maintainer_for_project.project,
		project.slug
	FROM
		maintainer_for_project
	LEFT JOIN
		project ON project.id = maintainer_for_project.project;
$$;

-- Project maintainers list with basic personal info
-- used in the project maintainer list
CREATE FUNCTION maintainers_of_project(project_id UUID) RETURNS TABLE (
	maintainer UUID,
	name VARCHAR[],
	email VARCHAR[],
	affiliation VARCHAR[]
) LANGUAGE plpgsql STABLE SECURITY DEFINER AS
$$
DECLARE account_authenticated UUID;
BEGIN
	account_authenticated = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	IF account_authenticated IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please login first';
	END IF;

	IF project_id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide a project id';
	END IF;

	IF NOT project_id IN (SELECT * FROM projects_of_current_maintainer()) AND
		CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (
			SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER
		) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not a maintainer of this project';
	END IF;

	RETURN QUERY
	SELECT
		maintainer_for_project.maintainer,
		ARRAY_AGG(login_for_account.name),
		ARRAY_AGG(login_for_account.email),
		ARRAY_AGG(login_for_account.home_organisation) AS affiliation
	FROM
		maintainer_for_project
	JOIN
		login_for_account ON maintainer_for_project.maintainer = login_for_account.account
	WHERE maintainer_for_project.project = project_id
	GROUP BY maintainer_for_project.maintainer;
	RETURN;
END
$$;

-- Keywords with the count used in projects
-- used by search to show existing keywords with the count
CREATE FUNCTION keyword_count_for_projects() RETURNS TABLE (
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
				keyword_for_project.keyword,
				COUNT(keyword_for_project.keyword) AS cnt
			FROM
				keyword_for_project
			GROUP BY keyword_for_project.keyword
		) AS keyword_count ON keyword.id = keyword_count.keyword;
$$;

-- Keywords by project
-- for selecting keywords of specific project
-- using filter ?project=eq.UUID
CREATE FUNCTION keywords_by_project() RETURNS TABLE (
	id UUID,
	keyword CITEXT,
	project UUID
) LANGUAGE sql STABLE AS
$$
	SELECT
		keyword.id,
		keyword.value AS keyword,
		keyword_for_project.project
	FROM
		keyword_for_project
	INNER JOIN
		keyword ON keyword.id = keyword_for_project.keyword;
$$;


-- Research domains by project
CREATE FUNCTION research_domain_by_project() RETURNS TABLE (
	id UUID,
	"key" VARCHAR,
	name VARCHAR,
	description VARCHAR,
	project UUID
) LANGUAGE sql STABLE AS
$$
	SELECT
		research_domain.id,
		research_domain.key,
		research_domain.name,
		research_domain.description,
		research_domain_for_project.project
	FROM
		research_domain_for_project
	INNER JOIN
		research_domain ON research_domain.id=research_domain_for_project.research_domain;
$$;

-- Software maintainers list with basic personal info
-- used in the software maintainer list
CREATE FUNCTION maintainers_of_software(software_id UUID) RETURNS TABLE (
	maintainer UUID,
	name VARCHAR[],
	email VARCHAR[],
	affiliation VARCHAR[]
) LANGUAGE plpgsql STABLE SECURITY DEFINER AS
$$
DECLARE account_authenticated UUID;
BEGIN
	account_authenticated = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	IF account_authenticated IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please login first';
	END IF;

	IF software_id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide a software id';
	END IF;

	IF NOT software_id IN (SELECT * FROM software_of_current_maintainer()) AND
		CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (
			SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER
		) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not a maintainer of this software';
	END IF;

	RETURN QUERY
	SELECT
		maintainer_for_software.maintainer,
		ARRAY_AGG(login_for_account.name),
		ARRAY_AGG(login_for_account.email),
		ARRAY_AGG(login_for_account.home_organisation) AS affiliation
	FROM
		maintainer_for_software
	JOIN
		login_for_account ON maintainer_for_software.maintainer = login_for_account.account
	WHERE maintainer_for_software.software = software_id
	GROUP BY maintainer_for_software.maintainer;
	RETURN;
END
$$;


-- ORGANISATIONS BY MAINTAINER
-- NOTE! each organisation is shown multiple times in this view
-- we filter this view at least by user account (maintainer_id uuid) on primary_maintainer or maintainer
CREATE FUNCTION organisations_by_maintainer(maintainer_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	parent UUID,
	primary_maintainer UUID,
	name VARCHAR,
	ror_id VARCHAR,
	website VARCHAR,
	is_tenant BOOLEAN,
	logo_id VARCHAR,
	software_cnt BIGINT,
	project_cnt BIGINT,
	children_cnt BIGINT,
	rsd_path VARCHAR
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT ON (organisation.id)
	organisation.id,
	organisation.slug,
	organisation.parent,
	organisation.primary_maintainer,
	organisation.name,
	organisation.ror_id,
	organisation.website,
	organisation.is_tenant,
	organisation.logo_id,
	software_count_by_organisation.software_cnt,
	project_count_by_organisation.project_cnt,
	children_count_by_organisation.children_cnt,
	organisation_route.rsd_path
FROM
	organisation
LEFT JOIN
	software_count_by_organisation() ON software_count_by_organisation.organisation = organisation.id
LEFT JOIN
	project_count_by_organisation() ON project_count_by_organisation.organisation = organisation.id
LEFT JOIN
	children_count_by_organisation() ON children_count_by_organisation.parent = organisation.id
LEFT JOIN
	maintainer_for_organisation ON maintainer_for_organisation.organisation = organisation.id
LEFT JOIN
	organisation_route(organisation.id) ON organisation_route.organisation = organisation.id
WHERE
	maintainer_for_organisation.maintainer = maintainer_id OR organisation.primary_maintainer = maintainer_id;
$$;

-- COUNTS by maintainer
-- software_cnt, project_cnt, organisation_cnt, communities_cnt
-- counts for user profile pages
-- this rpc returns json object instead of array
CREATE FUNCTION counts_by_maintainer(
	OUT software_cnt BIGINT,
	OUT project_cnt BIGINT,
	OUT organisation_cnt BIGINT,
	OUT community_cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	SELECT COUNT(*) FROM software_of_current_maintainer() INTO software_cnt;
	SELECT COUNT(*) FROM projects_of_current_maintainer() INTO project_cnt;
	SELECT COUNT(DISTINCT organisations_of_current_maintainer)
		FROM organisations_of_current_maintainer() INTO organisation_cnt;
	SELECT COUNT(DISTINCT communities_of_current_maintainer)
		FROM communities_of_current_maintainer() INTO community_cnt;
END
$$;


-- ORGANISATION maintainers list with basic personal info
-- used in the organisation maintainers page
CREATE FUNCTION maintainers_of_organisation(organisation_id UUID) RETURNS TABLE (
	maintainer UUID,
	name VARCHAR[],
	email VARCHAR[],
	affiliation VARCHAR[],
	is_primary BOOLEAN
) LANGUAGE plpgsql STABLE SECURITY DEFINER AS
$$
DECLARE account_authenticated UUID;
BEGIN
	account_authenticated = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	IF account_authenticated IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please login first';
	END IF;

	IF organisation_id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide a organisation id';
	END IF;

	IF NOT organisation_id IN (SELECT * FROM organisations_of_current_maintainer()) AND
		CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (
			SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER
		) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not a maintainer of this organisation';
	END IF;

	RETURN QUERY
	-- primary maintainer of organisation
	SELECT
		organisation.primary_maintainer AS maintainer,
		ARRAY_AGG(login_for_account."name") AS name,
		ARRAY_AGG(login_for_account.email) AS email,
		ARRAY_AGG(login_for_account.home_organisation) AS affiliation,
		TRUE AS is_primary
	FROM
		organisation
	INNER JOIN
		login_for_account ON organisation.primary_maintainer = login_for_account.account
	WHERE
		organisation.id = organisation_id
	GROUP BY
		organisation.id,organisation.primary_maintainer
	-- append second selection
	UNION
	-- other maintainers of organisation
	SELECT
		maintainer_for_organisation.maintainer,
		ARRAY_AGG(login_for_account."name") AS name,
		ARRAY_AGG(login_for_account.email) AS email,
		ARRAY_AGG(login_for_account.home_organisation) AS affiliation,
		FALSE AS is_primary
	FROM
		maintainer_for_organisation
	INNER JOIN
		login_for_account ON maintainer_for_organisation.maintainer = login_for_account.account
	WHERE
		maintainer_for_organisation.organisation = organisation_id
	GROUP BY
		maintainer_for_organisation.organisation, maintainer_for_organisation.maintainer
	-- primary as first record
	ORDER BY is_primary DESC;
	RETURN;
END
$$;

-- TOTAL COUNTS FOR HOMEPAGE
-- software_cnt, project_cnt, organisation_cnt
-- this rpc returns json object instead of array
CREATE FUNCTION homepage_counts(
	OUT software_cnt BIGINT,
	OUT open_software_cnt BIGINT,
	OUT project_cnt BIGINT,
	OUT organisation_cnt BIGINT,
	OUT contributor_cnt BIGINT,
	OUT software_mention_cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	SELECT COUNT(id) FROM software INTO software_cnt;
	SELECT COUNT(id) FROM software WHERE NOT closed_source INTO open_software_cnt;
	SELECT COUNT(id) FROM project INTO project_cnt;
	SELECT
		COUNT(id) AS organisation_cnt
	FROM
		organisations_overview(TRUE)
	WHERE
		organisations_overview.parent IS NULL AND organisations_overview.score>0
	INTO organisation_cnt;
	SELECT COUNT(DISTINCT(orcid,given_names,family_names)) FROM contributor INTO contributor_cnt;
	SELECT COUNT(mention) FROM mention_for_software INTO software_mention_cnt;
END
$$;


-- Keywords grouped by project
-- We use keywords array for filtering
-- We use keywords_text for "wild card" search
CREATE FUNCTION keyword_filter_for_project() RETURNS TABLE (
	project UUID,
	keywords CITEXT[],
	keywords_text TEXT
) LANGUAGE sql STABLE AS
$$
	SELECT
		keyword_for_project.project AS project,
		ARRAY_AGG(
			keyword.value
			ORDER BY value
		) AS keywords,
		STRING_AGG(
			keyword.value,' '
			ORDER BY value
		) AS keywords_text
	FROM
		keyword_for_project
	INNER JOIN
		keyword ON keyword.id = keyword_for_project.keyword
	GROUP BY keyword_for_project.project;
$$;

-- RESEARCH DOMAIN grouped by project
-- We use array for exact filtering by KEY
-- We use research_domain_text for "wild card" search when filter is not active
CREATE FUNCTION research_domain_filter_for_project() RETURNS TABLE (
	project UUID,
	research_domain VARCHAR[],
	research_domain_text TEXT
) LANGUAGE sql STABLE AS
$$
	SELECT
		research_domain_for_project.project AS project,
		ARRAY_AGG(
			research_domain.key
			ORDER BY key
		) AS research_domain,
		STRING_AGG(
			research_domain.key || ' ' || research_domain."name",' '
			ORDER BY key
		) AS research_domain_text
	FROM
		research_domain_for_project
	INNER JOIN
		research_domain ON research_domain.id = research_domain_for_project.research_domain
	GROUP BY research_domain_for_project.project;
$$;


-- GLOBAL SEARCH
CREATE FUNCTION global_search(query VARCHAR) RETURNS TABLE(
	slug VARCHAR,
	name VARCHAR,
	source TEXT,
	is_published BOOLEAN,
	rank INTEGER,
	index_found INTEGER
) LANGUAGE sql STABLE AS
$$
	-- SOFTWARE search item
	SELECT
		software.slug,
		software.brand_name AS name,
		'software' AS "source",
		software.is_published,
		(CASE
			WHEN software.slug ILIKE query OR software.brand_name ILIKE query THEN 0
			WHEN BOOL_OR(keyword.value ILIKE query) THEN 1
			WHEN software.slug ILIKE CONCAT(query, '%') OR software.brand_name ILIKE CONCAT(query, '%') THEN 2
			WHEN software.slug ILIKE CONCAT('%', query, '%') OR software.brand_name ILIKE CONCAT('%', query, '%') THEN 3
			ELSE 4
		END) AS rank,
		(CASE
			WHEN software.slug ILIKE query OR software.brand_name ILIKE query THEN 0
			WHEN BOOL_OR(keyword.value ILIKE query) THEN 0
			WHEN software.slug ILIKE CONCAT(query, '%') OR software.brand_name ILIKE CONCAT(query, '%') THEN 0
			WHEN software.slug ILIKE CONCAT('%', query, '%') OR software.brand_name ILIKE CONCAT('%', query, '%') THEN LEAST(POSITION(query IN software.slug), POSITION(query IN software.brand_name))
			ELSE 0
		END) AS index_found
	FROM
		software
	LEFT JOIN keyword_for_software ON keyword_for_software.software = software.id
	LEFT JOIN keyword ON keyword.id = keyword_for_software.keyword
	GROUP BY software.id
	HAVING
		software.slug ILIKE CONCAT('%', query, '%')
		OR
		software.brand_name ILIKE CONCAT('%', query, '%')
		OR
		software.short_statement ILIKE CONCAT('%', query, '%')
		OR
		BOOL_OR(keyword.value ILIKE CONCAT('%', query, '%'))
	UNION
	-- PROJECT search item
	SELECT
		project.slug,
		project.title AS name,
		'projects' AS "source",
		project.is_published,
		(CASE
			WHEN project.slug ILIKE query OR project.title ILIKE query THEN 0
			WHEN BOOL_OR(keyword.value ILIKE query) THEN 1
			WHEN project.slug ILIKE CONCAT(query, '%') OR project.title ILIKE CONCAT(query, '%') THEN 2
			WHEN project.slug ILIKE CONCAT('%', query, '%') OR project.title ILIKE CONCAT('%', query, '%') THEN 3
			ELSE 4
		END) AS rank,
		(CASE
			WHEN project.slug ILIKE query OR project.title ILIKE query THEN 0
			WHEN BOOL_OR(keyword.value ILIKE query) THEN 0
			WHEN project.slug ILIKE CONCAT(query, '%') OR project.title ILIKE CONCAT(query, '%') THEN 0
			WHEN project.slug ILIKE CONCAT('%', query, '%') OR project.title ILIKE CONCAT('%', query, '%') THEN LEAST(POSITION(query IN project.slug), POSITION(query IN project.title))
			ELSE 0
		END) AS index_found
	FROM
		project
	LEFT JOIN keyword_for_project ON keyword_for_project.project = project.id
	LEFT JOIN keyword ON keyword.id = keyword_for_project.keyword
	GROUP BY project.id
	HAVING
		project.slug ILIKE CONCAT('%', query, '%')
		OR
		project.title ILIKE CONCAT('%', query, '%')
		OR
		project.subtitle ILIKE CONCAT('%', query, '%')
		OR
		BOOL_OR(keyword.value ILIKE CONCAT('%', query, '%'))
	UNION
	-- ORGANISATION search item
	SELECT
		organisation.slug,
		organisation."name",
		'organisations' AS "source",
		TRUE AS is_published,
		(CASE
			WHEN organisation.slug ILIKE query OR organisation."name" ILIKE query THEN 0
			WHEN organisation.slug ILIKE CONCAT(query, '%') OR organisation."name" ILIKE CONCAT(query, '%') THEN 2
			ELSE 3
		END) AS rank,
		(CASE
			WHEN organisation.slug ILIKE query OR organisation."name" ILIKE query THEN 0
			WHEN organisation.slug ILIKE CONCAT(query, '%') OR organisation."name" ILIKE CONCAT(query, '%') THEN 0
			ELSE LEAST(POSITION(query IN organisation.slug), POSITION(query IN organisation."name"))
		END) AS index_found
	FROM
		organisation
	WHERE
	-- ONLY TOP LEVEL ORGANISATIONS
		organisation.parent IS NULL
		AND
		(organisation.slug ILIKE CONCAT('%', query, '%') OR organisation."name" ILIKE CONCAT('%', query, '%'))
;
$$;


-- Check whether user agreed on Terms of Service and read the Privacy Statement
CREATE FUNCTION user_agreements_stored(account_id UUID) RETURNS BOOLEAN LANGUAGE sql STABLE AS
$$
	SELECT (
		account.agree_terms AND
		account.notice_privacy_statement
	)
	FROM
		account
	WHERE
		account.id = account_id;
$$;

-- Display amount of users per home_organisation
CREATE VIEW user_count_per_home_organisation AS
	SELECT
		home_organisation,
		COUNT(*)
	FROM
		login_for_account
	GROUP BY
		home_organisation
	;

-- Return the number of accounts since specified time stamp
CREATE FUNCTION new_accounts_count_since_timestamp(timestmp TIMESTAMPTZ) RETURNS INTEGER
LANGUAGE sql SECURITY DEFINER STABLE AS
$$
SELECT
	COUNT(account.created_at)
FROM
	account
WHERE
	created_at > timestmp;
$$;

-- Keywords use by software and projects
-- DEPENDS ON FUNCTIONS keyword_count_for_software and keyword_count_for_projects
CREATE FUNCTION keyword_cnt() RETURNS TABLE (
	id UUID,
	keyword CITEXT,
	software_cnt BIGINT,
	projects_cnt BIGINT
) LANGUAGE sql SECURITY DEFINER STABLE AS
$$
SELECT
	keyword.id,
	keyword.value AS keyword,
	keyword_count_for_software.cnt AS software_cnt,
	keyword_count_for_projects.cnt AS projects_cnt
FROM
	keyword
LEFT JOIN
	keyword_count_for_software() ON keyword.value = keyword_count_for_software.keyword
LEFT JOIN
	keyword_count_for_projects() ON keyword.value = keyword_count_for_projects.keyword
;
$$;

--  Suggest a platform type based on the input of other users in the RSD
CREATE FUNCTION suggest_platform(hostname VARCHAR(200)) RETURNS platform_type
LANGUAGE SQL STABLE AS
$$
SELECT
	code_platform
FROM
	(
		SELECT
			url,
			code_platform
		FROM
			repository_url
	) AS sub
WHERE
	(
		-- Returns the hostname of sub.url
		SELECT
			TOKEN
		FROM
			ts_debug(sub.url)
		WHERE
			alias = 'host'
	) = hostname
GROUP BY
	sub.code_platform
ORDER BY
	COUNT(*)
DESC LIMIT
	1;
;
$$;
