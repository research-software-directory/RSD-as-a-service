-- SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2023 dv4all
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
--
-- SPDX-License-Identifier: Apache-2.0

-- ALL unique persons in RSD (contributors and team members) with their roles
-- TO BE USED IN SEARCH from 23-3-2023
-- NOTE! UNION takes care of duplicate entries
CREATE FUNCTION unique_person_entries() RETURNS TABLE (
	display_name TEXT,
	given_names VARCHAR,
	family_names VARCHAR,
	email_address VARCHAR,
	affiliation VARCHAR,
	"role" VARCHAR,
	avatar_id VARCHAR,
	orcid VARCHAR,
	account UUID
) LANGUAGE sql STABLE AS
$$
SELECT DISTINCT
	(CONCAT(contributor.given_names,' ',contributor.family_names)) AS display_name,
	contributor.given_names,
	contributor.family_names,
	contributor.email_address,
	contributor.affiliation,
	contributor.role,
	contributor.avatar_id,
	contributor.orcid,
	contributor.account
FROM
	contributor
UNION
SELECT DISTINCT
	(CONCAT(team_member.given_names,' ',team_member.family_names)) AS display_name,
	team_member.given_names,
	team_member.family_names,
	team_member.email_address,
	team_member.affiliation,
	team_member.role,
	team_member.avatar_id,
	team_member.orcid,
	team_member.account
FROM
	team_member
ORDER BY
	display_name ASC;
$$;

-- Aggregate avatars by display_name (given_names + family_names)
-- USED in rsd admins section
CREATE FUNCTION person_avatars_by_name() RETURNS TABLE (
	display_name TEXT,
	avatars VARCHAR[]
) LANGUAGE sql STABLE AS
$$
	SELECT
		unique_person_entries.display_name,
		array_agg(DISTINCT(unique_person_entries.avatar_id)) AS avatars
	FROM
		unique_person_entries()
	WHERE
		unique_person_entries.avatar_id IS NOT NULL
	GROUP BY
		unique_person_entries.display_name
	;
$$;

-- Aggregate avatars by orcid (given_names + family_names)
-- USED in rsd admins section
CREATE FUNCTION person_avatars_by_orcid() RETURNS TABLE (
	orcid TEXT,
	avatars VARCHAR[]
) LANGUAGE sql STABLE AS
$$
	SELECT
		unique_person_entries.orcid,
		array_agg(DISTINCT(unique_person_entries.avatar_id)) AS avatars
	FROM
		unique_person_entries()
	WHERE
		unique_person_entries.avatar_id IS NOT NULL AND
		unique_person_entries.orcid IS NOT NULL
	GROUP BY
		unique_person_entries.orcid
	;
$$;

-- LIST ALL persons mentioned in software and projects
-- origin indicates source table
-- slug is direct link to edit this entry
-- avatars are aggregated on display_name (given_names + ' ' + family_names)
-- AND avatars are aggregated on ORCID
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
	slug VARCHAR,
	public_orcid_profile VARCHAR,
	avatars_by_name VARCHAR[],
	avatars_by_orcid VARCHAR[]
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
	software.slug,
	public_profile.orcid as public_orcid_profile,
	person_avatars_by_name.avatars AS avatars_by_name,
	person_avatars_by_orcid.avatars	AS avatars_by_orcid
FROM
	contributor
INNER JOIN
	software ON contributor.software = software.id
LEFT JOIN
	public_profile() ON public_profile.orcid=contributor.orcid
LEFT JOIN
	person_avatars_by_name() ON person_avatars_by_name.display_name = CONCAT(contributor.given_names,' ',contributor.family_names)
LEFT JOIN
	person_avatars_by_orcid() ON person_avatars_by_orcid.orcid = contributor.orcid
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
	project.slug,
	public_profile.orcid as public_orcid_profile,
	person_avatars_by_name.avatars AS avatars_by_name,
	person_avatars_by_orcid.avatars	AS avatars_by_orcid
FROM
	team_member
INNER JOIN
	project ON team_member.project = project.id
LEFT JOIN
	public_profile() ON public_profile.orcid = team_member.orcid
LEFT JOIN
	person_avatars_by_name() ON person_avatars_by_name.display_name = CONCAT(team_member.given_names,' ',	team_member.family_names)
LEFT JOIN
	person_avatars_by_orcid() ON person_avatars_by_orcid.orcid = team_member.orcid
$$;

--ROLES ALREADY IN RSD
--Use this to suggest roles in the modal
CREATE FUNCTION suggested_roles() RETURNS
VARCHAR[] LANGUAGE sql STABLE AS
$$
	SELECT
	ARRAY_AGG("role")
	FROM (
		SELECT
			"role"
		FROM
			contributor
		WHERE
			"role" IS NOT NULL
		UNION
		SELECT
			"role"
		FROM
			team_member
		WHERE
		"role" IS NOT NULL
	) roles;
$$;
