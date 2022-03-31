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
		count(*) AS project_cnt
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
		organisation.parent, count(*) as children_cnt
	FROM
		organisation
	WHERE
		organisation.parent is not null
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
		children_count_by_organisation() on o.id = children_count_by_organisation.parent
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