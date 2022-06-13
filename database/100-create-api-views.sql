-- SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2021 - 2022 dv4all
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic
-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
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
				count(keyword_for_software.keyword) AS cnt
			FROM
				keyword_for_software
			GROUP BY keyword_for_software.keyword
		) AS keyword_count ON keyword.id = keyword_count.keyword
	;
END
$$;

-- Keywords by software
-- for selecting keywords of specific software
-- using filter ?project=eq.UUID
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

-- SOFTWARE OVERVIEW LIST WITH COUNTS
CREATE FUNCTION software_list() RETURNS TABLE (
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
CREATE OR REPLACE FUNCTION unique_contributors() RETURNS TABLE (display_name TEXT, affiliation VARCHAR, orcid VARCHAR, given_names VARCHAR, family_names VARCHAR, email_address VARCHAR, avatar_mime_type VARCHAR) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT DISTINCT
		(CONCAT(c.given_names,' ',c.family_names)) AS display_name, c.affiliation, c.orcid, c.given_names, c.family_names, c.email_address, c.avatar_mime_type
	FROM
		contributor c
	ORDER BY
		display_name ASC;
END
$$;

-- Participating organisations by software
CREATE FUNCTION organisations_of_software() RETURNS TABLE (id UUID, slug VARCHAR, primary_maintainer UUID, name VARCHAR, ror_id VARCHAR, is_tenant BOOLEAN, website VARCHAR, logo_id UUID, status relation_status, software UUID) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		organisation.id AS id,
		organisation.slug,
		organisation.primary_maintainer,
		organisation.name,
		organisation.ror_id,
		organisation.is_tenant,
		organisation.website,
		logo_for_organisation.organisation AS logo_id,
		software_for_organisation.status,
		software.id AS software
FROM
	software
INNER JOIN
	software_for_organisation ON software.id = software_for_organisation.software
INNER JOIN
	organisation ON software_for_organisation.organisation = organisation.id
LEFT JOIN
	logo_for_organisation ON logo_for_organisation.organisation = organisation.id;
END
$$;

-- Software count by organisation
CREATE FUNCTION software_count_by_organisation() RETURNS TABLE (organisation UUID, software_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		software_for_organisation.organisation, count(software_for_organisation.organisation) AS software_cnt
	FROM
		software_for_organisation
	GROUP BY software_for_organisation.organisation;
END
$$;

-- Project count by organisation
CREATE FUNCTION project_count_by_organisation() RETURNS TABLE (
	organisation UUID,
	project_cnt BIGINT
)LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		project_for_organisation.organisation,
		COUNT(*) AS project_cnt
	FROM
		project_for_organisation
	GROUP BY project_for_organisation.organisation;
END
$$;

-- Direct children count by organisation
CREATE FUNCTION children_count_by_organisation() RETURNS TABLE (
	parent UUID,
	children_cnt BIGINT
)LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		organisation.parent, COUNT(*) AS children_cnt
	FROM
		organisation
	WHERE
		organisation.parent IS NOT NULL
	GROUP BY
		organisation.parent
	;
END
$$;

-- Organisations overview
CREATE FUNCTION organisations_overview() RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	parent UUID,
	primary_maintainer UUID,
	name VARCHAR,
	ror_id VARCHAR,
	website VARCHAR,
	is_tenant BOOLEAN,
	logo_id UUID,
	software_cnt BIGINT,
	project_cnt BIGINT,
	children_cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		o.id AS id,
		o.slug,
		o.parent,
		o.primary_maintainer,
		o.name,
		o.ror_id,
		o.website,
		o.is_tenant,
		logo_for_organisation.organisation AS logo_id,
		software_count_by_organisation.software_cnt,
		project_count_by_organisation.project_cnt,
		children_count_by_organisation.children_cnt
	FROM
		organisation o
	LEFT JOIN
		software_count_by_organisation() ON software_count_by_organisation.organisation = o.id
	LEFT JOIN
		project_count_by_organisation() ON project_count_by_organisation.organisation = o.id
	LEFT JOIN
		children_count_by_organisation() ON o.id = children_count_by_organisation.parent
	LEFT JOIN
		logo_for_organisation ON o.id = logo_for_organisation.organisation;
END
$$;

-- Software info by organisation
-- NOTE! one software is shown multiple times in this view
-- we filter this view at least by organisation uuid
CREATE FUNCTION software_by_organisation() RETURNS TABLE (
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
	SELECT
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
	;
END
$$;

-- Project info by organisation
-- NOTE! single project is shown multiple times in this view
-- we filter this view at least by organisation (uuid)
CREATE FUNCTION projects_by_organisation() RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	date_start DATE,
	date_end DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	is_featured BOOLEAN,
	image_id UUID,
	organisation UUID,
	status relation_status
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		project.date_start,
		project.date_end,
		project.updated_at,
		project.is_published,
		project_for_organisation.is_featured,
		image_for_project.project AS image_id,
		project_for_organisation.organisation,
		project_for_organisation.status
	FROM
		project
	LEFT JOIN
		image_for_project ON project.id = image_for_project.project
	LEFT JOIN
		project_for_organisation ON project.id = project_for_organisation.project;
END
$$;


-- Participating organisations by project
-- NOTE! organisation are shown multiple times (for each project)
-- we filter this view by project UUID
CREATE FUNCTION organisations_of_project() RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	primary_maintainer UUID,
	name VARCHAR,
	ror_id VARCHAR,
	is_tenant BOOLEAN,
	website VARCHAR,
	logo_id UUID,
	status relation_status,
	role organisation_role,
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
			logo_for_organisation.organisation AS logo_id,
			project_for_organisation.status,
			project_for_organisation.role,
			project.id AS project,
			organisation.parent
	FROM
		project
	INNER JOIN
		project_for_organisation ON project.id = project_for_organisation.project
	INNER JOIN
		organisation ON project_for_organisation.organisation = organisation.id
	LEFT JOIN
		logo_for_organisation ON logo_for_organisation.organisation = organisation.id
	;
END
$$;

-- RELATED PROJECTS of project (origin)
-- filter by origin to get related project for the origin
CREATE FUNCTION related_projects_for_project() RETURNS TABLE (
	origin UUID,
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	date_end DATE,
	updated_at TIMESTAMPTZ,
	status relation_status,
	image_id UUID
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
		project.date_end,
		project.updated_at,
		project_for_project.status,
		image_for_project.project AS image_id
	FROM
		project
	LEFT JOIN
		image_for_project ON image_for_project.project = project.id
	INNER JOIN
		project_for_project ON project.id = project_for_project.relation
	;
END
$$;

-- RELATED PROJECTS for software
-- filter by software
CREATE FUNCTION related_projects_for_software() RETURNS TABLE (
	software UUID,
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	date_end DATE,
	updated_at TIMESTAMPTZ,
	status relation_status,
	image_id UUID
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
		project.date_end,
		project.updated_at,
		software_for_project.status,
		image_for_project.project AS image_id
	FROM
		project
	LEFT JOIN
		image_for_project ON image_for_project.project = project.id
	INNER JOIN
		software_for_project ON project.id = software_for_project.project
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

	IF NOT project_id IN (SELECT * FROM projects_of_current_maintainer()) THEN
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
				count(keyword_for_project.keyword) AS cnt
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
CREATE OR REPLACE FUNCTION unique_team_members() RETURNS TABLE (
	display_name TEXT,
	affiliation VARCHAR,
	orcid VARCHAR,
	given_names VARCHAR,
	family_names VARCHAR,
	email_address VARCHAR
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
			c.email_address
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

	IF NOT software_id IN (SELECT * FROM software_of_current_maintainer()) THEN
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
-- NOTE! single project is shown multiple times in this view
-- we filter this view at least by user acount (uuid)
CREATE FUNCTION projects_by_maintainer(maintainer_id UUID) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	date_start DATE,
	date_end DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_id UUID
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		project.id,
		project.slug,
		project.title,
		project.subtitle,
		project.date_start,
		project.date_end,
		project.updated_at,
		project.is_published,
		image_for_project.project AS image_id
	FROM
		project
	LEFT JOIN
		image_for_project ON project.id = image_for_project.project
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
	logo_id UUID,
	software_cnt BIGINT,
	project_cnt BIGINT,
	children_cnt BIGINT
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		o.id,
		o.slug,
		o.parent,
		o.primary_maintainer,
		o.name,
		o.ror_id,
		o.website,
		o.is_tenant,
		logo_for_organisation.organisation AS logo_id,
		software_count_by_organisation.software_cnt,
		project_count_by_organisation.project_cnt,
		children_count_by_organisation.children_cnt
	FROM
		organisation AS o
	LEFT JOIN
		logo_for_organisation ON o.id = logo_for_organisation.organisation
	LEFT JOIN
		software_count_by_organisation() ON software_count_by_organisation.organisation = o.id
	LEFT JOIN
		project_count_by_organisation() ON project_count_by_organisation.organisation = o.id
	LEFT JOIN
		children_count_by_organisation() ON o.id = children_count_by_organisation.parent
	LEFT JOIN
		maintainer_for_organisation ON o.id = maintainer_for_organisation.organisation
	WHERE
		maintainer_for_organisation.maintainer = maintainer_id OR o.primary_maintainer = maintainer_id;
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

	IF NOT organisation_id IN (SELECT * FROM organisations_of_current_maintainer()) THEN
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
		organisation.id  = organisation_id
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
