-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

-- PROJECT OVERVIEW LIST
-- WITH KEYWORDS and research domain for filtering
CREATE FUNCTION project_overview() RETURNS TABLE (
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

-- PROJECT OVERVIEW LIST FOR SEARCH
-- WITH KEYWORDS and research domain for filtering
CREATE FUNCTION project_search(search VARCHAR) RETURNS TABLE (
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
) LANGUAGE sql STABLE AS
$$
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


CREATE FUNCTION project_quality(show_all BOOLEAN DEFAULT FALSE) RETURNS TABLE (
	slug VARCHAR,
	title VARCHAR,
	has_subtitle BOOLEAN,
	is_published BOOLEAN,
	has_start_date BOOLEAN,
	has_end_date BOOLEAN,
	has_image BOOLEAN,
	team_member_cnt INTEGER,
	has_contact_person BOOLEAN,
	participating_org_cnt INTEGER,
	funding_org_cnt INTEGER,
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
	project.date_start IS NOT NULL,
	project.date_end IS NOT NULL,
	project.image_id IS NOT NULL,
	COALESCE(count_project_team_members.team_member_cnt, 0),
	COALESCE(count_project_team_members.has_contact_person, FALSE),
	COALESCE(count_project_organisations.participating_org_cnt, 0),
	COALESCE(count_project_organisations.funding_org_cnt, 0),
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
