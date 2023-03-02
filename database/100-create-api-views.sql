-- SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2021 - 2023 dv4all
-- SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all) (dv4all)
-- SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
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
		) AS keyword_count ON keyword.id = keyword_count.keyword
	;
END
$$;

-- Keywords by software
-- for selecting keywords of specific software
-- using filter ?software=eq.UUID
CREATE FUNCTION keywords_by_software() RETURNS TABLE (
	id UUID,
	keyword CITEXT,
	software UUID
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
SELECT
	keyword.id,
	keyword.value AS keyword,
	keyword_for_software.software
FROM
	keyword_for_software
INNER JOIN
	keyword ON keyword.id = keyword_for_software.keyword
;
END
$$;

-- Keywords grouped by software for filtering
-- We use array for selecting software with specific keywords
-- We use text value for "wild card" search
CREATE FUNCTION keyword_filter_for_software() RETURNS TABLE (
	software UUID,
	keywords CITEXT[],
	keywords_text TEXT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
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
	GROUP BY keyword_for_software.software
;
END
$$;


-- COUNT contributors per software
CREATE FUNCTION count_software_countributors() RETURNS TABLE (software UUID, contributor_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		contributor.software, COUNT(contributor.id) AS contributor_cnt
	FROM
		contributor
	GROUP BY
		contributor.software;
END
$$;

-- COUNT mentions per software
CREATE FUNCTION count_software_mentions() RETURNS TABLE (software UUID, mention_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		mention_for_software.software, COUNT(mention) AS mention_cnt
	FROM
		mention_for_software
	GROUP BY
		mention_for_software.software;
END
$$;

-- JOIN contributors and mentions counts per software
CREATE FUNCTION count_software_contributors_mentions() RETURNS TABLE (id UUID, contributor_cnt BIGINT, mention_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		software.id, count_software_countributors.contributor_cnt, count_software_mentions.mention_cnt
	FROM
		software
	LEFT JOIN
		count_software_countributors() AS count_software_countributors ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() AS count_software_mentions ON software.id=count_software_mentions.software;
END
$$;

-- programming language counts for software
-- used in software filter - language dropdown
CREATE FUNCTION prog_lang_cnt_for_software() RETURNS TABLE (
	prog_lang TEXT,
	cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		JSONB_OBJECT_KEYS(languages) AS "prog_lang",
		COUNT(software) AS cnt
	FROM
		repository_url
	GROUP BY
		JSONB_OBJECT_KEYS(languages)
	;
END
$$;

-- programming language filter for software
-- used by software_search func
CREATE FUNCTION prog_lang_filter_for_software() RETURNS TABLE (
	software UUID,
	prog_lang TEXT[]
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		repository_url.software,
		(SELECT
			ARRAY_AGG(p_lang)
		FROM
			JSONB_OBJECT_KEYS(repository_url.languages) p_lang
		) AS "prog_lang"
	FROM
		repository_url
	;
END
$$;

-- SOFTWARE OVERVIEW LIST FOR SEARCH
-- WITH COUNTS and KEYWORDS for filtering
CREATE FUNCTION software_search() RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	updated_at TIMESTAMPTZ,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	is_published BOOLEAN,
	keywords CITEXT[],
	keywords_text TEXT,
	prog_lang TEXT[]
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.updated_at,
		count_software_countributors.contributor_cnt,
		count_software_mentions.mention_cnt,
		software.is_published,
		keyword_filter_for_software.keywords,
		keyword_filter_for_software.keywords_text,
		prog_lang_filter_for_software.prog_lang
	FROM
		software
	LEFT JOIN
		count_software_countributors() ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	LEFT JOIN
		keyword_filter_for_software() ON software.id=keyword_filter_for_software.software
	LEFT JOIN
		prog_lang_filter_for_software() ON software.id=prog_lang_filter_for_software.software
	;
END
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.updated_at,
		count_software_countributors.contributor_cnt,
		count_software_mentions.mention_cnt,
		software.is_published
	FROM
		software
	LEFT JOIN
		count_software_countributors() ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	INNER JOIN
		software_for_software ON software.id=software_for_software.relation
	WHERE
		software_for_software.origin = software_id
	;
END
$$;

-- Software maintainer by software slug
CREATE FUNCTION maintainer_for_software_by_slug() RETURNS TABLE (maintainer UUID, software UUID, slug VARCHAR) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		maintainer_for_software.maintainer, maintainer_for_software.software, software.slug
	FROM
		maintainer_for_software
	LEFT JOIN
		software ON software.id = maintainer_for_software.software;
END
$$;

-- UNIQUE contributor display_names
CREATE FUNCTION unique_contributors() RETURNS TABLE (
	display_name TEXT,
	affiliation VARCHAR,
	orcid VARCHAR,
	given_names VARCHAR,
	family_names VARCHAR,
	email_address VARCHAR,
	avatar_id VARCHAR
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
		SELECT DISTINCT
		(CONCAT(c.given_names,' ',c.family_names)) AS display_name,
		c.affiliation,
		c.orcid,
		c.given_names,
		c.family_names,
		c.email_address,
		c.avatar_id
	FROM
		contributor c
	ORDER BY
		display_name ASC;
END
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
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
		software.id = software_id
	;
END
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
SELECT
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN RETURN QUERY
	SELECT
		releases_by_organisation.release_year,
		COUNT(releases_by_organisation.*) AS release_cnt
	FROM
		releases_by_organisation()
	WHERE
		releases_by_organisation.organisation_id = release_cnt_by_year.organisation_id
	GROUP BY
		releases_by_organisation.release_year
	;
END
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

-- Software info by organisation
-- NOTE! one software is shown multiple times in this view
-- we filter this view at least by organisation uuid
CREATE FUNCTION software_by_organisation(organisation_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	is_published BOOLEAN,
	is_featured BOOLEAN,
	status relation_status,
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	updated_at TIMESTAMPTZ,
	organisation UUID
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT DISTINCT ON (software.id)
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.is_published,
		software_for_organisation.is_featured,
		software_for_organisation.status,
		count_software_countributors.contributor_cnt,
		count_software_mentions.mention_cnt,
		software.updated_at,
		software_for_organisation.organisation
	FROM
		software
	LEFT JOIN
		software_for_organisation ON software.id=software_for_organisation.software
	LEFT JOIN
		count_software_countributors() ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	WHERE
		software_for_organisation.organisation IN (
			SELECT list_child_organisations.organisation_id FROM list_child_organisations(organisation_id)
		)
	;
END
$$;

-- Project info by organisation
-- NOTE! updated by Dusan 2022-07-27
-- we filter this view at least by organisation_id (uuid)
CREATE FUNCTION projects_by_organisation(organisation_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	current_state VARCHAR,
	date_start DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	is_featured BOOLEAN,
	image_id VARCHAR,
	organisation UUID,
	status relation_status,
	keywords citext[]
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT DISTINCT ON (project.id)
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_start IS NULL THEN 'Starting'::VARCHAR
			WHEN project.date_start > now() THEN 'Starting'::VARCHAR
			WHEN project.date_end < now() THEN 'Finished'::VARCHAR
			ELSE 'Running'::VARCHAR
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		project.image_contain,
		project_for_organisation.is_featured,
		project.image_id,
		project_for_organisation.organisation,
		project_for_organisation.status,
		keyword_filter_for_project.keywords
	FROM
		project
	LEFT JOIN
		project_for_organisation ON project.id = project_for_organisation.project
	LEFT JOIN
		keyword_filter_for_project() ON project.id=keyword_filter_for_project.project
	WHERE
		project_for_organisation.organisation IN (SELECT list_child_organisations.organisation_id FROM list_child_organisations(organisation_id))
	;
END
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
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
		project.id = project_id
	;
END
$$;

-- RELATED PROJECTS of project (origin)
-- NOTE! updated by Dusan 2022-07-27
-- filter by origin to get related project for the origin
CREATE FUNCTION related_projects_for_project(origin_id UUID) RETURNS TABLE (
	origin UUID,
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	current_state VARCHAR,
	date_start DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	status relation_status,
	image_id VARCHAR
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		project_for_project.origin,
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_start IS NULL THEN 'Starting'::VARCHAR
			WHEN project.date_start > now() THEN 'Starting'::VARCHAR
			WHEN project.date_end < now() THEN 'Finished'::VARCHAR
			ELSE 'Running'::VARCHAR
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		project.image_contain,
		project_for_project.status,
		project.image_id
	FROM
		project
	INNER JOIN
		project_for_project ON project.id = project_for_project.relation
	WHERE
		project_for_project.origin = origin_id
	;
END
$$;

-- RELATED PROJECTS for software
-- NOTE! updated by Dusan 2022-07-27
-- filter by software_id
CREATE FUNCTION related_projects_for_software(software_id UUID) RETURNS TABLE (
	software UUID,
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	current_state VARCHAR,
	date_start DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	status relation_status,
	image_id VARCHAR
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		software_for_project.software,
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_start IS NULL THEN 'Starting'::VARCHAR
			WHEN project.date_start > now() THEN 'Starting'::VARCHAR
			WHEN project.date_end < now() THEN 'Finished'::VARCHAR
			ELSE 'Running'::VARCHAR
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		project.image_contain,
		software_for_project.status,
		project.image_id
	FROM
		project
	INNER JOIN
		software_for_project ON project.id = software_for_project.project
	WHERE
		software_for_project.software = software_id
	;
END
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.updated_at,
		count_software_countributors.contributor_cnt,
		count_software_mentions.mention_cnt,
		software.is_published,
		software_for_project.status
	FROM
		software
	LEFT JOIN
		count_software_countributors() ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	INNER JOIN
		software_for_project ON software.id=software_for_project.software
	WHERE
		software_for_project.project=project_id
	;
END
$$;

-- Project maintainer by slug
-- there are similar functions for software maintainers
CREATE FUNCTION maintainer_for_project_by_slug() RETURNS TABLE (
	maintainer UUID,
	project UUID,
	slug VARCHAR
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		maintainer_for_project.maintainer,
		maintainer_for_project.project,
		project.slug
	FROM
		maintainer_for_project
	LEFT JOIN
		project ON project.id = maintainer_for_project.project;
END
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
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
		) AS keyword_count ON keyword.id = keyword_count.keyword
	;
END
$$;

-- Keywords by project
-- for selecting keywords of specific project
-- using filter ?project=eq.UUID
CREATE FUNCTION keywords_by_project() RETURNS TABLE (
	id UUID,
	keyword CITEXT,
	project UUID
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
SELECT
	keyword.id,
	keyword.value AS keyword,
	keyword_for_project.project
FROM
	keyword_for_project
INNER JOIN
	keyword ON keyword.id = keyword_for_project.keyword
;
END
$$;


-- Research domains by project
CREATE FUNCTION research_domain_by_project() RETURNS TABLE (
	id UUID,
	"key" VARCHAR,
	name VARCHAR,
	description VARCHAR,
	project UUID
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
SELECT
	research_domain.id,
	research_domain.key,
	research_domain.name,
	research_domain.description,
	research_domain_for_project.project
FROM
	research_domain_for_project
INNER JOIN
	research_domain ON research_domain.id=research_domain_for_project.research_domain
;
END
$$;

-- UNIQUE LIST OF TEAM MEMBERS
-- used in Find
CREATE FUNCTION unique_team_members() RETURNS TABLE (
	display_name TEXT,
	affiliation VARCHAR,
	orcid VARCHAR,
	given_names VARCHAR,
	family_names VARCHAR,
	email_address VARCHAR,
	avatar_id VARCHAR
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
		SELECT DISTINCT
			(CONCAT(c.given_names,' ',c.family_names)) AS display_name,
			c.affiliation,
			c.orcid,
			c.given_names,
			c.family_names,
			c.email_address,
			c.avatar_id
		FROM
			team_member c
		ORDER BY
			display_name ASC;
END
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


-- SOFTWARE BY MAINTAINER
-- NOTE! one software is shown multiple times in this view
-- we filter this view at least by organisation uuid
CREATE FUNCTION software_by_maintainer(maintainer_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	brand_name VARCHAR,
	short_statement VARCHAR,
	is_published BOOLEAN,
	updated_at TIMESTAMPTZ,
	contributor_cnt BIGINT,
	mention_cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		software.id,
		software.slug,
		software.brand_name,
		software.short_statement,
		software.is_published,
		software.updated_at,
		count_software_countributors.contributor_cnt,
		count_software_mentions.mention_cnt
	FROM
		software
	LEFT JOIN
		count_software_countributors() ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() ON software.id=count_software_mentions.software
	INNER JOIN
		maintainer_for_software ON software.id=maintainer_for_software.software
	WHERE
		maintainer_for_software.maintainer=maintainer_id
;
END
$$;

-- PROJECTS BY MAINTAINER
-- NOTE! updated by Dusan on 2022-07-27
-- we filter this view at least by user acount (uuid)
CREATE FUNCTION projects_by_maintainer(maintainer_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	current_state VARCHAR,
	date_start DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	image_id VARCHAR
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_start IS NULL THEN 'Starting'::VARCHAR
			WHEN project.date_start > now() THEN 'Starting'::VARCHAR
			WHEN project.date_end < now() THEN 'Finished'::VARCHAR
			ELSE 'Running'::VARCHAR
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		project.image_contain,
		project.image_id
	FROM
		project
	INNER JOIN
		maintainer_for_project ON project.id = maintainer_for_project.project
	WHERE
		maintainer_for_project.maintainer = maintainer_id;
END
$$;

-- ORGANISATIONS BY MAINTAINER
-- NOTE! each organisation is shown multiple times in this view
-- we filter this view at least by user acount (maintainer_id uuid) on primary_maintainer or maintainer
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
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
END
$$;

-- COUNTS by maintainer
-- software_cnt, project_cnt, organisation_cnt
-- counts for user profile pages
-- this rpc returns json object instead of array
CREATE FUNCTION counts_by_maintainer(
	OUT software_cnt BIGINT,
	OUT project_cnt BIGINT,
	OUT organisation_cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	SELECT COUNT(*) FROM software_of_current_maintainer() INTO software_cnt;
	SELECT COUNT(*) FROM projects_of_current_maintainer() INTO project_cnt;
	SELECT COUNT(DISTINCT organisations_of_current_maintainer)
		FROM organisations_of_current_maintainer() INTO organisation_cnt;
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
	OUT project_cnt BIGINT,
	OUT organisation_cnt BIGINT,
	OUT contributor_cnt BIGINT,
	OUT software_mention_cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	SELECT COUNT(id) FROM software INTO software_cnt;
	SELECT COUNT(id) FROM project INTO project_cnt;
	SELECT
		COUNT(id) AS organisation_cnt
	FROM
		organisations_overview(TRUE)
	WHERE
		organisations_overview.parent IS NULL AND organisations_overview.score>0
	INTO organisation_cnt;
	SELECT COUNT(display_name) FROM unique_contributors() INTO contributor_cnt;
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
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
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
	GROUP BY keyword_for_project.project
;
END
$$;

-- RESEARCH DOMAIN grouped by project
-- We use array for exact filtering by KEY
-- We use research_domain_text for "wild card" search when filter is not active
CREATE FUNCTION research_domain_filter_for_project() RETURNS TABLE (
	project UUID,
	research_domain VARCHAR[],
	research_domain_text TEXT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
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
	GROUP BY research_domain_for_project.project
;
END
$$;


-- PROJECT OVERVIEW LIST FOR SEARCH
-- WITH KEYWORDS and research domain for filtering
CREATE FUNCTION project_search() RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	current_state VARCHAR,
	date_start DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	image_id VARCHAR,
	keywords citext[],
	keywords_text TEXT,
	research_domain VARCHAR[],
	research_domain_text TEXT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		CASE
			WHEN project.date_start IS NULL THEN 'Starting'::VARCHAR
			WHEN project.date_start > now() THEN 'Starting'::VARCHAR
			WHEN project.date_end < now() THEN 'Finished'::VARCHAR
			ELSE 'Running'::VARCHAR
		END AS current_state,
		project.date_start,
		project.updated_at,
		project.is_published,
		project.image_contain,
		project.image_id,
		keyword_filter_for_project.keywords,
		keyword_filter_for_project.keywords_text,
		research_domain_filter_for_project.research_domain,
		research_domain_filter_for_project.research_domain_text
	FROM
		project
	LEFT JOIN
		keyword_filter_for_project() ON project.id=keyword_filter_for_project.project
	LEFT JOIN
		research_domain_filter_for_project() ON project.id=research_domain_filter_for_project.project
	;
END
$$;

-- RESEARCH DOMAIN count used in project filter
-- to show used research domains with count
CREATE FUNCTION research_domain_count_for_projects() RETURNS TABLE (
	id UUID,
	key VARCHAR,
	name VARCHAR,
	cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		research_domain.id,
		research_domain.key,
		research_domain.name,
		research_domain_count.cnt
	FROM
		research_domain
	LEFT JOIN
		(SELECT
				research_domain_for_project.research_domain,
				COUNT(research_domain_for_project.research_domain) AS cnt
			FROM
				research_domain_for_project
			GROUP BY research_domain_for_project.research_domain
		) AS research_domain_count ON research_domain.id = research_domain_count.research_domain
	;
END
$$;

-- GLOBAL SEARCH
-- we use search_text to concatenate all values to use
CREATE FUNCTION global_search() RETURNS TABLE(
	slug VARCHAR,
	name VARCHAR,
	source TEXT,
	is_published BOOLEAN,
	search_text TEXT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN RETURN QUERY
	-- SOFTWARE search item
	SELECT
		software_search.slug,
		software_search.brand_name AS name,
		'software' AS "source",
		software_search.is_published,
		CONCAT_WS(
			' ',
			software_search.brand_name,
			software_search.short_statement,
			software_search.keywords_text
		) AS search_text
	FROM
		software_search()
	UNION
	-- PROJECT search item
	SELECT
		project_search.slug,
		project_search.title AS name,
		'projects' AS "source",
		project_search.is_published,
		CONCAT_WS(
			' ',
			project_search.title,
			project_search.subtitle,
			project_search.keywords_text,
			project_search.research_domain_text
		) AS search_text
	FROM
		project_search()
	UNION
	-- ORGANISATION search item
	SELECT
		organisation.slug,
		organisation."name",
		'organisations' AS "source",
		TRUE AS is_published,
		CONCAT_WS(
			' ',
			organisation."name",
			organisation.website
		) AS search_text
	FROM
		organisation
;
END
$$;

-- ALL unique persons in RSD (contributors and team members)
-- TO BE USED IN SEARCH
-- NOTE! UNION takes care of duplicate entries
CREATE FUNCTION unique_persons() RETURNS TABLE (
	display_name TEXT,
	affiliation VARCHAR,
	orcid VARCHAR,
	given_names VARCHAR,
	family_names VARCHAR,
	email_address VARCHAR,
	avatar_id VARCHAR
) LANGUAGE plpgsql STABLE AS
$$
BEGIN RETURN QUERY
	SELECT
		unique_contributors.display_name,
		unique_contributors.affiliation,
		unique_contributors.orcid,
		unique_contributors.given_names,
		unique_contributors.family_names,
		unique_contributors.email_address,
		unique_contributors.avatar_id
	FROM
		unique_contributors()
	UNION
	SELECT
		unique_team_members.display_name,
		unique_team_members.affiliation,
		unique_team_members.orcid,
		unique_team_members.given_names,
		unique_team_members.family_names,
		unique_team_members.email_address,
		unique_team_members.avatar_id
	FROM
		unique_team_members()
	ORDER BY
		display_name ASC;
END
$$;

-- Check whether user agreed on Terms of Service and read the Privacy Statement
CREATE FUNCTION user_agreements_stored(account_id UUID) RETURNS BOOLEAN LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN (
		SELECT (
			account.agree_terms = TRUE AND
			account.notice_privacy_statement = TRUE
		)
		FROM
			account
		WHERE
			account.id = account_id
	);
END
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
