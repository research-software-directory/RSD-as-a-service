-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

-- ALL unique persons in RSD (contributors and team members) with their roles
-- TO BE USED IN SEARCH from 23-3-2023
-- NOTE! UNION takes care of duplicate entries
CREATE FUNCTION unique_person_entries() RETURNS TABLE (
	display_name TEXT,
	affiliation VARCHAR,
	orcid VARCHAR,
	given_names VARCHAR,
	family_names VARCHAR,
	email_address VARCHAR,
	"role" VARCHAR,
	avatar_id VARCHAR
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT
	(CONCAT(contributor.given_names,' ',contributor.family_names)) AS display_name,
	contributor.affiliation,
	contributor.orcid,
	contributor.given_names,
	contributor.family_names,
	contributor.email_address,
	contributor.role,
	contributor.avatar_id
FROM
	contributor
UNION
SELECT DISTINCT
	(CONCAT(team_member.given_names,' ',team_member.family_names)) AS display_name,
	team_member.affiliation,
	team_member.orcid,
	team_member.given_names,
	team_member.family_names,
	team_member.email_address,
	team_member.role,
	team_member.avatar_id
FROM
	team_member
ORDER BY
	display_name ASC;
$$;

-- LIST ALL persons mentioned in software and projects
-- origin indicates source table
-- slug is direct link to edit this entry
CREATE FUNCTION person_mentions() RETURNS TABLE (
	id UUID,
	given_names VARCHAR,
	family_names VARCHAR,
	email_address VARCHAR,
	affiliation VARCHAR,
	"role" VARCHAR,
	orcid VARCHAR,
	avatar_id VARCHAR,
	origin VARCHAR,
	slug VARCHAR
) LANGUAGE sql STABLE AS
$$
SELECT
	contributor.id,
	contributor.given_names,
	contributor.family_names,
	contributor.email_address,
	contributor.affiliation,
	contributor.role,
	contributor.orcid,
	contributor.avatar_id,
	'contributor' AS origin,
	software.slug
FROM
	public_profile()
INNER JOIN
	contributor ON public_profile.orcid=contributor.orcid
INNER JOIN
	software ON contributor.software = software.id
UNION
SELECT
	team_member.id,
	team_member.given_names,
	team_member.family_names,
	team_member.email_address,
	team_member.affiliation,
	team_member.role,
	team_member.orcid,
	team_member.avatar_id,
	'team_member' AS origin,
	project.slug
FROM
	public_profile()
INNER JOIN
	team_member ON public_profile.orcid = team_member.orcid
INNER JOIN
	project ON team_member.project = project.id
$$;
