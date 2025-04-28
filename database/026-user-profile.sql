-- SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
-- SPDX-FileCopyrightText: 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2025 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

-- USER PROFILE TABLE
CREATE TABLE user_profile (
	account UUID REFERENCES account (id) PRIMARY KEY,
	given_names VARCHAR(200) NOT NULL,
	family_names VARCHAR(200) NOT NULL,
	email_address VARCHAR(200),
	role VARCHAR(200) CHECK (role ~ '^\S+( \S+)*$'),
	affiliation VARCHAR(200) CHECK (affiliation ~ '^\S+( \S+)*$'),
	is_public BOOLEAN DEFAULT FALSE NOT NULL,
	avatar_id VARCHAR(40) REFERENCES image(id),
	description VARCHAR(10000),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_user_profile() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	-- use account uuid from token ?
	-- NEW.account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_user_profile
	BEFORE INSERT ON user_profile
	FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_user_profile();


CREATE FUNCTION sanitise_update_user_profile() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.account = OLD.account;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_login_for_account
	BEFORE UPDATE ON user_profile
	FOR EACH ROW EXECUTE PROCEDURE sanitise_update_user_profile();

---------------------------------------------------------
--------- ROW LEVEL SECURITY (RLS) ----------------------
---------------------------------------------------------
-- Step 1: Enable Row-Level Security
---------------------------------------
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

------------------------------------
-- Step 2: Define RLS policies
------------------------------------
-- RLS policy for rsd_web_anon (only public profiles)
CREATE POLICY public_user_profile ON user_profile FOR SELECT TO rsd_web_anon
	USING (is_public);

-- RLS policy for rsd_user (only your profile)
CREATE POLICY my_user_profile ON user_profile FOR SELECT TO rsd_user
	USING (account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

-- RLS INSERT policy for rsd_user
CREATE POLICY maintainer_insert_rights ON user_profile FOR INSERT TO rsd_user
	WITH CHECK (account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

-- RLS DELETE policy for rsd_user
CREATE POLICY maintainer_delete_rights ON user_profile FOR DELETE TO rsd_user
	USING (account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

-- RLS UPDATE policy for rsd_user
CREATE POLICY maintainer_update_rights ON user_profile FOR UPDATE TO rsd_user
	USING (account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'))
	WITH CHECK (account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

-- RLS policy for rsd_admin
CREATE POLICY admin_all_rights ON user_profile TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- Create function with elevated privileges
-- in order to return only orcids for public profiles
-- USED by rpc/person_mentions in 104-person-views
CREATE FUNCTION public_profile() RETURNS TABLE (
	orcid VARCHAR
) LANGUAGE sql STABLE SECURITY DEFINER AS
$$
SELECT
	login_for_account.sub as orcid
FROM
	login_for_account
INNER JOIN
	user_profile ON login_for_account.account = user_profile.account
WHERE
	login_for_account.provider='orcid' AND user_profile.is_public
$$;

-- Public user profile information for profile page
-- this info overwrites aggregated contributors/team member info
-- from /rpc/person_mentions in 104-person-views
CREATE FUNCTION public_user_profile() RETURNS TABLE (
	display_name VARCHAR,
	given_names VARCHAR,
	family_names VARCHAR,
	email_address VARCHAR,
	affiliation VARCHAR,
	"role" VARCHAR,
	avatar_id VARCHAR(40),
	orcid VARCHAR,
	account UUID,
	is_public BOOLEAN
) LANGUAGE sql STABLE SECURITY DEFINER AS
$$
SELECT
	(CONCAT(user_profile.given_names,' ',user_profile.family_names)) AS display_name,
	user_profile.given_names,
	user_profile.family_names,
	user_profile.email_address,
	user_profile.affiliation,
	user_profile.role,
	user_profile.avatar_id,
	login_for_account.sub AS orcid,
	user_profile.account,
	user_profile.is_public
FROM
	user_profile
LEFT JOIN
	login_for_account ON
		user_profile.account = login_for_account.account
		AND
		login_for_account.provider = 'orcid'
WHERE
	user_profile.is_public
$$;
