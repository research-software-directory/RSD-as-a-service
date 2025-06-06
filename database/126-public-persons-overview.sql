-- SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- Software count per person
-- based on account id OR ORCID
-- acc_id = account, orc_id = ORCID
CREATE FUNCTION software_cnt_by_person(acc_id UUID, orc_id VARCHAR) RETURNS TABLE(
	software_cnt BIGINT,
	acc_id UUID,
	orc_id VARCHAR
) LANGUAGE sql STABLE as
$$
SELECT
	count(*) AS software_cnt,
	acc_id,
	orc_id
FROM
	software_by_public_profile()
WHERE
	software_by_public_profile.orcid = orc_id
	OR
	software_by_public_profile.account = acc_id
$$;

-- Project count per person
-- based on account id OR ORCID
-- acc_id = account, orc_id = ORCID
CREATE FUNCTION project_cnt_by_person(acc_id UUID, orc_id VARCHAR) RETURNS TABLE(
	project_cnt BIGINT,
	acc_id UUID,
	orc_id VARCHAR
) LANGUAGE sql STABLE as
$$
SELECT
	count(*) AS project_cnt,
	acc_id,
	orc_id
FROM
	project_by_public_profile()
WHERE
	project_by_public_profile.orcid = orc_id
	OR
	project_by_public_profile.account = acc_id
$$;

-- Public user profile information for profile page
-- this info overwrites aggregated contributors/team member info
-- from /rpc/person_mentions in 104-person-views
CREATE FUNCTION public_persons_overview() RETURNS TABLE (
	account UUID,
	display_name VARCHAR,
	affiliation VARCHAR,
	"role" VARCHAR,
	avatar_id VARCHAR(40),
	orcid VARCHAR,
	is_public BOOLEAN,
	software_cnt BIGINT,
	project_cnt BIGINT,
	-- include keywords for future use
	keywords VARCHAR[]
) LANGUAGE sql STABLE SECURITY DEFINER AS
$$
SELECT
	public_user_profile.account,
	public_user_profile.display_name,
	public_user_profile.affiliation,
	public_user_profile.role,
	public_user_profile.avatar_id,
	public_user_profile.orcid,
	public_user_profile.is_public,
	software_cnt_by_person.software_cnt,
	project_cnt_by_person.project_cnt,
	-- include keywords for future use
	array[]::varchar[] AS keywords
FROM
	public_user_profile()
LEFT JOIN
	software_cnt_by_person(public_user_profile.account,public_user_profile.orcid) ON (
		software_cnt_by_person.acc_id = public_user_profile.account
		OR
		software_cnt_by_person.orc_id = public_user_profile.orcid
	)
LEFT JOIN
	project_cnt_by_person(public_user_profile.account,public_user_profile.orcid) ON (
		project_cnt_by_person.acc_id = public_user_profile.account
		OR
		project_cnt_by_person.orc_id = public_user_profile.orcid
	)
$$;
