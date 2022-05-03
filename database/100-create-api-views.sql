-- NOTE1: Moved views to (stable) functions because views do not allow for RLS (row-level-security)
-- SEE issue https://github.com/research-software-directory/RSD-as-a-service/issues/170

-- NOTE2: After creating new function you might need to reload postgREST to be able to access the function

-- count of software per tag
CREATE FUNCTION count_software_per_tag() RETURNS TABLE (count BIGINT, tag tag) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		COUNT(*),
		tag_for_software.tag
	FROM
		tag_for_software
	JOIN software ON
		tag_for_software.software = software.id
	GROUP BY
		tag_for_software.tag;
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
		logo_for_organisation.id AS logo_id,
		software_for_organisation.status,
		software.id AS software
FROM
	software
INNER JOIN
	software_for_organisation ON software.id = software_for_organisation.software
INNER JOIN
	organisation ON software_for_organisation.organisation = organisation.id
LEFT JOIN
	logo_for_organisation ON logo_for_organisation.id = organisation.id;
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
		logo_for_organisation.id AS logo_id,
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
		logo_for_organisation ON o.id = logo_for_organisation.id;
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
	contributor_cnt BIGINT,
	mention_cnt BIGINT,
	updated_at TIMESTAMP,
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
		software.is_featured,
		count_software_contributors_mentions.contributor_cnt,
		count_software_contributors_mentions.mention_cnt,
		software.updated_at,
		software_for_organisation.organisation
	FROM
		software
	LEFT JOIN
		software_for_organisation ON software.id = software_for_organisation.software
	LEFT JOIN
		count_software_contributors_mentions() on software.id = count_software_contributors_mentions.id;
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
	updated_at TIMESTAMP,
	is_published BOOLEAN,
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
	project UUID
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
			logo_for_organisation.id AS logo_id,
			project_for_organisation.status,
			project_for_organisation.role,
			project.id AS project
	FROM
		project
	INNER JOIN
		project_for_organisation ON project.id = project_for_organisation.project
	INNER JOIN
		organisation ON project_for_organisation.organisation = organisation.id
	LEFT JOIN
		logo_for_organisation ON logo_for_organisation.id = organisation.id
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
	updated_at TIMESTAMP,
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
		image_for_project.project AS image_id
	FROM
		project
	LEFT JOIN
		image_for_project ON image_for_project.project = project.id
	LEFT JOIN
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
	updated_at TIMESTAMP,
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
		image_for_project.project AS image_id
	FROM
		project
	LEFT JOIN
		image_for_project ON image_for_project.project = project.id
	LEFT JOIN
		software_for_project ON project.id = software_for_project.project
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
CREATE FUNCTION maintainers_of_project() RETURNS TABLE (
	maintainer UUID,
	project UUID,
	slug VARCHAR,
	name VARCHAR,
	email VARCHAR,
	affiliation VARCHAR
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
	SELECT
		maintainer_for_project.maintainer,
		maintainer_for_project.project,
		project.slug,
		login_for_account.name,
		login_for_account.email,
		login_for_account.home_organisation AS affiliation
	FROM
		maintainer_for_project
	LEFT JOIN
		login_for_account ON maintainer_for_project.maintainer = login_for_account.account
	LEFT JOIN
			project ON project.id = maintainer_for_project.project
	;
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