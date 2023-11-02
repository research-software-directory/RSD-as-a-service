-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION count_project_team_members() RETURNS TABLE (
	project UUID,
	team_member_cnt INTEGER,
	has_contact_person BOOLEAN
) LANGUAGE sql STABLE AS
$$
SELECT
	team_member.project,
	COUNT(team_member.id),
	BOOL_OR(team_member.is_contact_person)
FROM
	team_member
GROUP BY
	team_member.project;
$$;


CREATE FUNCTION count_project_related_software() RETURNS TABLE (
	project UUID,
	software_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	software_for_project.project,
	COUNT(software_for_project.software)
FROM
	software_for_project
WHERE
	software_for_project.status = 'approved'
GROUP BY
	software_for_project.project;
$$;


CREATE FUNCTION count_project_related_projects() RETURNS TABLE (
	project UUID,
	project_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	id,
	COUNT(DISTINCT relations)
FROM
(
	SELECT
		project_for_project.origin AS id,
		UNNEST(ARRAY_AGG(project_for_project.relation)) AS relations
	FROM
		project_for_project
	WHERE
		project_for_project.status = 'approved'
	GROUP BY
		project_for_project.origin
	UNION ALL
	SELECT
		project_for_project.relation AS id,
		UNNEST(ARRAY_AGG(project_for_project.origin)) AS relations
	FROM
		project_for_project
	WHERE
		project_for_project.status = 'approved'
	GROUP BY
		project_for_project.relation
) AS cnts
GROUP BY id;
$$;


CREATE FUNCTION count_project_organisations() RETURNS TABLE (
	project UUID,
	participating_org_cnt INTEGER,
	funding_org_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	project_for_organisation.project,
	COUNT(CASE WHEN project_for_organisation.role = 'participating' THEN 1 END),
	COUNT(CASE WHEN project_for_organisation.role = 'funding' THEN 1 END)
FROM
	project_for_organisation
WHERE
	project_for_organisation.status = 'approved'
GROUP BY
	project_for_organisation.project;
$$;


CREATE FUNCTION count_project_keywords() RETURNS TABLE (
	project UUID,
	keyword_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	keyword_for_project.project,
	COUNT(keyword_for_project.keyword)
FROM
	keyword_for_project
GROUP BY
	keyword_for_project.project;
$$;


CREATE FUNCTION count_project_research_domains() RETURNS TABLE (
	project UUID,
	research_domain_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	research_domain_for_project.project,
	COUNT(research_domain_for_project.research_domain)
FROM
	research_domain_for_project
GROUP BY
	research_domain_for_project.project;
$$;


CREATE FUNCTION count_project_impact() RETURNS TABLE (
	project UUID,
	impact_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	impact_for_project.project,
	COUNT(impact_for_project.mention)
FROM
	impact_for_project
GROUP BY
	impact_for_project.project;
$$;


CREATE FUNCTION count_project_output() RETURNS TABLE (
	project UUID,
	output_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	output_for_project.project,
	COUNT(output_for_project.mention)
FROM
	output_for_project
GROUP BY
	output_for_project.project;
$$;

CREATE FUNCTION project_status() RETURNS TABLE (
	project UUID,
	status VARCHAR(20)
) LANGUAGE sql STABLE AS
$$
SELECT
	project.id,
	CASE
		WHEN project.date_end < now() THEN 'finished'::VARCHAR
		WHEN project.date_start > now() THEN 'upcoming'::VARCHAR
		WHEN project.date_start < now() AND project.date_end > now() THEN 'in_progress'::VARCHAR
		ELSE 'unknown'::VARCHAR
	END AS status
FROM
	project
$$;

CREATE FUNCTION project_quality(show_all BOOLEAN DEFAULT FALSE) RETURNS TABLE (
	slug VARCHAR,
	title VARCHAR,
	has_subtitle BOOLEAN,
	is_published BOOLEAN,
	date_start DATE,
	date_end DATE,
	grant_id VARCHAR,
	has_image BOOLEAN,
	team_member_cnt INTEGER,
	has_contact_person BOOLEAN,
	participating_org_cnt INTEGER,
	funding_org_cnt INTEGER,
	software_cnt INTEGER,
	project_cnt INTEGER,
	keyword_cnt INTEGER,
	research_domain_cnt INTEGER,
	impact_cnt INTEGER,
	output_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	project.slug,
	project.title,
	project.subtitle IS NOT NULL,
	project.is_published,
	project.date_start,
	project.date_end,
	project.grant_id,
	project.image_id IS NOT NULL,
	COALESCE(count_project_team_members.team_member_cnt, 0),
	COALESCE(count_project_team_members.has_contact_person, FALSE),
	COALESCE(count_project_organisations.participating_org_cnt, 0),
	COALESCE(count_project_organisations.funding_org_cnt, 0),
	COALESCE(count_project_related_software.software_cnt, 0),
	COALESCE(count_project_related_projects.project_cnt, 0),
	COALESCE(count_project_keywords.keyword_cnt, 0),
	COALESCE(count_project_research_domains.research_domain_cnt, 0),
	COALESCE(count_project_impact.impact_cnt, 0),
	COALESCE(count_project_output.output_cnt, 0)
FROM
	project
LEFT JOIN
	count_project_team_members() ON project.id = count_project_team_members.project
LEFT JOIN
	count_project_organisations() ON project.id = count_project_organisations.project
LEFT JOIN
	count_project_related_software() ON project.id = count_project_related_software.project
LEFT JOIN
	count_project_related_projects() ON project.id = count_project_related_projects.project
LEFT JOIN
	count_project_keywords() ON project.id = count_project_keywords.project
LEFT JOIN
	count_project_research_domains() ON project.id = count_project_research_domains.project
LEFT JOIN
	count_project_impact() ON project.id = count_project_impact.project
LEFT JOIN
	count_project_output() ON project.id = count_project_output.project
WHERE
	CASE WHEN show_all IS TRUE THEN TRUE ELSE project.id IN (SELECT * FROM projects_of_current_maintainer()) END;
$$;

-- RELATED PROJECTS for project_id
-- use bi-directional linking: project_id used as origin or relation
CREATE FUNCTION related_projects_for_project(project_id UUID) RETURNS TABLE (
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
	status relation_status,
	origin UUID,
	relation UUID
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT ON (project.id)
	project.id,
	project.slug,
	project.title,
	project.subtitle,
	project_status.status AS current_state,
	project.date_start,
	project.updated_at,
	project.is_published,
	project.image_contain,
	project.image_id,
	project_for_project.status,
	project_for_project.origin,
	project_for_project.relation
FROM
	project
INNER JOIN
	project_for_project ON
		(project.id = project_for_project.relation AND project_for_project.origin = project_id)
		OR
		(project.id = project_for_project.origin AND project_for_project.relation = project_id)
LEFT JOIN
	project_status() ON project.id=project_status.project
;
$$;

-- AGGREGATE participating organisations per project for project_overview RPC
-- use only TOP LEVEL organisations (parent IS NULL)
CREATE FUNCTION project_participating_organisations() RETURNS TABLE (
	project UUID,
	organisations VARCHAR[]
) LANGUAGE sql STABLE AS
$$
SELECT
	project_for_organisation.project,
	ARRAY_AGG(organisation.name) AS organisations
FROM
	organisation
INNER JOIN
	project_for_organisation ON organisation.id = project_for_organisation.organisation
WHERE
	project_for_organisation.role = 'participating' AND organisation.parent IS NULL
GROUP BY
	project_for_organisation.project
;
$$;


-- PROJECT OVERVIEW LIST
-- WHEN FILTERING/SEARCH IS NOT USED
CREATE FUNCTION project_overview() RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	date_start DATE,
	date_end DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	image_id VARCHAR,
	keywords citext[],
	keywords_text TEXT,
	research_domain VARCHAR[],
	research_domain_text TEXT,
	participating_organisations VARCHAR[],
	impact_cnt INTEGER,
	output_cnt INTEGER,
	project_status VARCHAR(20)
) LANGUAGE sql STABLE AS
$$
SELECT
	project.id,
	project.slug,
	project.title,
	project.subtitle,
	project.date_start,
	project.date_end,
	project.updated_at,
	project.is_published,
	project.image_contain,
	project.image_id,
	keyword_filter_for_project.keywords,
	keyword_filter_for_project.keywords_text,
	research_domain_filter_for_project.research_domain,
	research_domain_filter_for_project.research_domain_text,
	project_participating_organisations.organisations AS participating_organisations,
	COALESCE(count_project_impact.impact_cnt, 0) AS impact_cnt,
	COALESCE(count_project_output.output_cnt, 0) AS output_cnt,
	project_status.status
FROM
	project
LEFT JOIN
	keyword_filter_for_project() ON project.id=keyword_filter_for_project.project
LEFT JOIN
	research_domain_filter_for_project() ON project.id=research_domain_filter_for_project.project
LEFT JOIN
	project_participating_organisations() ON project.id=project_participating_organisations.project
LEFT JOIN
	count_project_impact() ON project.id=count_project_impact.project
LEFT JOIN
	count_project_output() ON project.id=count_project_output.project
LEFT JOIN
	project_status() ON project.id=project_status.project
;
$$;

-- PROJECT OVERVIEW LIST FOR SEARCH
-- WITH keywords, research domain and participating organisations for filtering
CREATE FUNCTION project_search(search VARCHAR) RETURNS TABLE (
	id UUID,
	slug VARCHAR,
	title VARCHAR,
	subtitle VARCHAR,
	date_start DATE,
	date_end DATE,
	updated_at TIMESTAMPTZ,
	is_published BOOLEAN,
	image_contain BOOLEAN,
	image_id VARCHAR,
	keywords citext[],
	keywords_text TEXT,
	research_domain VARCHAR[],
	research_domain_text TEXT,
	participating_organisations VARCHAR[],
	impact_cnt INTEGER,
	output_cnt INTEGER,
	project_status VARCHAR(20)
) LANGUAGE sql STABLE AS
$$
SELECT
	project.id,
	project.slug,
	project.title,
	project.subtitle,
	project.date_start,
	project.date_end,
	project.updated_at,
	project.is_published,
	project.image_contain,
	project.image_id,
	keyword_filter_for_project.keywords,
	keyword_filter_for_project.keywords_text,
	research_domain_filter_for_project.research_domain,
	research_domain_filter_for_project.research_domain_text,
	project_participating_organisations.organisations AS participating_organisations,
	COALESCE(count_project_impact.impact_cnt, 0),
	COALESCE(count_project_output.output_cnt, 0),
	project_status.status
FROM
	project
LEFT JOIN
	keyword_filter_for_project() ON project.id=keyword_filter_for_project.project
LEFT JOIN
	research_domain_filter_for_project() ON project.id=research_domain_filter_for_project.project
LEFT JOIN
	project_participating_organisations() ON project.id=project_participating_organisations.project
LEFT JOIN
	count_project_impact() ON project.id = count_project_impact.project
LEFT JOIN
	count_project_output() ON project.id = count_project_output.project
LEFT JOIN
	project_status() ON project.id=project_status.project
WHERE
	project.title ILIKE CONCAT('%', search, '%')
	OR
	project.slug ILIKE CONCAT('%', search, '%')
	OR
	project.subtitle ILIKE CONCAT('%', search, '%')
	OR
	keyword_filter_for_project.keywords_text ILIKE CONCAT('%', search, '%')
	OR
	research_domain_filter_for_project.research_domain_text ILIKE CONCAT('%', search, '%')
ORDER BY
	CASE
		WHEN title ILIKE search THEN 0
		WHEN title ILIKE CONCAT(search, '%') THEN 1
		WHEN title ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END,
	CASE
		WHEN slug ILIKE search THEN 0
		WHEN slug ILIKE CONCAT(search, '%') THEN 1
		WHEN slug ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END,
	CASE
		WHEN subtitle ILIKE search THEN 0
		WHEN subtitle ILIKE CONCAT(search, '%') THEN 1
		WHEN subtitle ILIKE CONCAT('%', search, '%') THEN 2
		ELSE 3
	END
;
$$;

-- REACTIVE KEYWORD FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE KEYWORDS FOR APPLIED FILTERS
CREATE FUNCTION project_keywords_filter(
	search_filter TEXT DEFAULT '',
	status_filter VARCHAR DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	keyword CITEXT,
	keyword_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(keywords) AS keyword,
	COUNT(id) AS keyword_cnt
FROM
	project_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
	AND
		CASE
			WHEN status_filter <> '' THEN project_status = status_filter
			ELSE true
		END
GROUP BY
	keyword
;
$$;


-- REACTIVE RESEARCH DOMAIN FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE DOMAINS FOR APPLIED FILTERS
CREATE FUNCTION project_domains_filter(
	search_filter TEXT DEFAULT '',
	status_filter VARCHAR DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	domain VARCHAR,
	domain_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(research_domain) AS domain,
	COUNT(id) AS domain_cnt
FROM
	project_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
	AND
		CASE
			WHEN status_filter <> '' THEN project_status = status_filter
			ELSE true
		END
GROUP BY
	domain
;
$$;

-- REACTIVE PARTICIPATING ORGANISATIONS FILTER WITH COUNTS FOR PROJECTS
-- PROVIDES AVAILABLE DOMAINS FOR APPLIED FILTERS
CREATE FUNCTION project_participating_organisations_filter(
	search_filter TEXT DEFAULT '',
	status_filter VARCHAR DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	organisation VARCHAR,
	organisation_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	UNNEST(participating_organisations) AS organisation,
	COUNT(id) AS organisation_cnt
FROM
	project_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
	AND
		CASE
			WHEN status_filter <> '' THEN project_status = status_filter
			ELSE true
		END
GROUP BY
	organisation
;
$$;

-- REACTIVE PROJECT STATUS WITH COUNTS
-- PROVIDES AVAILABLE DOMAINS FOR APPLIED FILTERS
CREATE FUNCTION project_status_filter(
	search_filter TEXT DEFAULT '',
	keyword_filter CITEXT[] DEFAULT '{}',
	research_domain_filter VARCHAR[] DEFAULT '{}',
	organisation_filter VARCHAR[] DEFAULT '{}'
) RETURNS TABLE (
	project_status VARCHAR,
	project_status_cnt INTEGER
) LANGUAGE sql STABLE AS
$$
SELECT
	project_status,
	COUNT(id) AS project_status_cnt
FROM
	project_search(search_filter)
WHERE
	COALESCE(keywords, '{}') @> keyword_filter
	AND
	COALESCE(research_domain, '{}') @> research_domain_filter
	AND
	COALESCE(participating_organisations, '{}') @> organisation_filter
GROUP BY
	project_status
;
$$;
