-- SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE community (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	slug VARCHAR(200) UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	name VARCHAR(200) NOT NULL,
	short_description VARCHAR(300),
	description VARCHAR(10000),
	primary_maintainer UUID REFERENCES account (id),
	logo_id VARCHAR(40) REFERENCES image(id),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

-- SANITISE insert and update
-- ONLY rsd_admin and primary_maintainer can change community table
-- ONLY rsd_admin can change primary_maintainer value
CREATE FUNCTION sanitise_insert_community() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;

	IF CURRENT_USER = 'rsd_admin' OR (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		RETURN NEW;
	END IF;

	RAISE EXCEPTION USING MESSAGE = 'You are not allowed to add this community';
END
$$;

CREATE TRIGGER sanitise_insert_community BEFORE INSERT ON community FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_community();


CREATE FUNCTION sanitise_update_community() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;

	IF NEW.slug IS DISTINCT FROM OLD.slug AND CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the slug';
	END IF;

	IF NEW.primary_maintainer IS DISTINCT FROM OLD.primary_maintainer AND CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the primary maintainer for community ' || OLD.name;
	END IF;

	RETURN NEW;
END
$$;

CREATE TRIGGER sanitise_update_community BEFORE UPDATE ON community FOR EACH ROW EXECUTE PROCEDURE sanitise_update_community();


-- MAINTAINER OF COMMUNITY
CREATE TABLE maintainer_for_community (
	maintainer UUID REFERENCES account (id),
	community UUID REFERENCES community (id),
	PRIMARY KEY (maintainer, community)
);


-- Needed for RLS on various tables
CREATE FUNCTION communities_of_current_maintainer() RETURNS SETOF UUID STABLE
LANGUAGE sql SECURITY DEFINER AS
$$
	SELECT
		id
	FROM
		community
	WHERE
		primary_maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
	UNION
	SELECT
		community
	FROM
		maintainer_for_community
	WHERE
		maintainer = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
$$;


-- RLS community table
ALTER TABLE community ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON community FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY maintainer_all_rights ON community TO rsd_user
	USING (id IN (SELECT * FROM communities_of_current_maintainer()))
	WITH CHECK (TRUE);

CREATE POLICY admin_all_rights ON community TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- RLS maintainer_for_community table
ALTER TABLE maintainer_for_community ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintainer_select ON maintainer_for_community FOR SELECT TO rsd_user
	USING (community IN (SELECT * FROM communities_of_current_maintainer()));

CREATE POLICY maintainer_delete ON maintainer_for_community FOR DELETE TO rsd_user
	USING (community IN (SELECT * FROM communities_of_current_maintainer()));

CREATE POLICY maintainer_insert ON maintainer_for_community FOR INSERT TO rsd_user
	WITH CHECK (community IN (SELECT * FROM communities_of_current_maintainer()));

CREATE POLICY admin_all_rights ON maintainer_for_community TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- INVITES FOR COMMUNITY MAINTAINER (magic link)
CREATE TABLE invite_maintainer_for_community (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	community UUID REFERENCES community (id) NOT NULL,
	created_by UUID REFERENCES account (id),
	claimed_by UUID REFERENCES account (id),
	claimed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT LOCALTIMESTAMP,
	expires_at TIMESTAMPTZ NOT NULL GENERATED ALWAYS AS (created_at AT TIME ZONE 'UTC' + INTERVAL '31 days') STORED
);

CREATE FUNCTION sanitise_insert_invite_maintainer_for_community() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.claimed_by = NULL;
	NEW.claimed_at = NULL;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_invite_maintainer_for_community BEFORE INSERT ON invite_maintainer_for_community FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_invite_maintainer_for_community();

CREATE FUNCTION sanitise_update_invite_maintainer_for_community() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.community = OLD.community;
	NEW.created_by = OLD.created_by;
	NEW.created_at = OLD.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_invite_maintainer_for_community BEFORE UPDATE ON invite_maintainer_for_community FOR EACH ROW EXECUTE PROCEDURE sanitise_update_invite_maintainer_for_community();

-- RLS invite_maintainer_for_community table
ALTER TABLE invite_maintainer_for_community ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintainer_select ON invite_maintainer_for_community FOR SELECT TO rsd_user
	USING (community IN (SELECT * FROM communities_of_current_maintainer())
		OR created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		OR claimed_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY maintainer_delete ON invite_maintainer_for_community FOR DELETE TO rsd_user
	USING (community IN (SELECT * FROM communities_of_current_maintainer())
		OR created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		OR claimed_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY maintainer_insert ON invite_maintainer_for_community FOR INSERT TO rsd_user
	WITH CHECK (community IN (SELECT * FROM communities_of_current_maintainer()) AND created_by = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account'));

CREATE POLICY admin_all_rights ON invite_maintainer_for_community TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


-- COMMUNITY maintainers list with basic personal info
-- used in the community maintainers page
CREATE FUNCTION maintainers_of_community(community_id UUID) RETURNS TABLE (
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

	IF community_id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide a community id';
	END IF;

	IF NOT community_id IN (SELECT * FROM communities_of_current_maintainer()) AND
		CURRENT_USER IS DISTINCT FROM 'rsd_admin' AND (
			SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER
		) IS DISTINCT FROM TRUE THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not a maintainer of this community';
	END IF;

	RETURN QUERY
	WITH maintainer_ids AS (
		-- primary maintainer of community
		SELECT
			community.primary_maintainer AS maintainer,
			TRUE AS is_primary
		FROM
			community
		WHERE
			community.id = community_id
		-- append second selection
		UNION ALL
		-- other maintainers of community
		SELECT
			maintainer_for_community.maintainer,
			FALSE AS is_primary
		FROM
			maintainer_for_community
		WHERE
			maintainer_for_community.community = community_id
		-- primary as first record
		ORDER BY is_primary DESC
	)
	SELECT
		maintainer_ids.maintainer AS maintainer,
		ARRAY_AGG(login_for_account."name") AS name,
		ARRAY_AGG(login_for_account.email) AS email,
		ARRAY_AGG(login_for_account.home_organisation) AS affiliation,
		BOOL_OR(maintainer_ids.is_primary) AS is_primary
	FROM
		maintainer_ids
	INNER JOIN
		login_for_account ON login_for_account.account = maintainer_ids.maintainer
	GROUP BY
		maintainer_ids.maintainer
	-- primary as first record
	ORDER BY
		is_primary DESC;
	RETURN;
END
$$;

-- ACCEPT MAGIC LINK INVITATION
-- REGISTER user with this link as maintainer of community
-- RETURN basic info about community on SUCCESS
CREATE FUNCTION accept_invitation_community(invitation UUID) RETURNS TABLE(
	id UUID,
	name VARCHAR,
	slug VARCHAR
) LANGUAGE plpgsql VOLATILE SECURITY DEFINER AS
$$
DECLARE invitation_row invite_maintainer_for_community%ROWTYPE;
DECLARE account UUID;
BEGIN
	account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	IF account IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please login first';
	END IF;

	IF invitation IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide an invitation id';
	END IF;

	SELECT * FROM
		invite_maintainer_for_community
	WHERE
		invite_maintainer_for_community.id = invitation INTO invitation_row;

	IF invitation_row.id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' does not exist';
	END IF;

	IF invitation_row.claimed_by IS NOT NULL OR invitation_row.claimed_at IS NOT NULL OR
		invitation_row.expires_at < CURRENT_TIMESTAMP THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' is expired';
	END IF;

-- Only use the invitation if not already a maintainer
	IF NOT EXISTS(
		SELECT
			maintainer_for_community.maintainer
		FROM
			maintainer_for_community
		WHERE
			maintainer_for_community.maintainer=account AND maintainer_for_community.community=invitation_row.community
		UNION
		SELECT
			community.primary_maintainer AS maintainer
		FROM
			community
		WHERE
			community.primary_maintainer=account AND community.id=invitation_row.community
		LIMIT 1
	) THEN

		UPDATE invite_maintainer_for_community
			SET claimed_by = account, claimed_at = LOCALTIMESTAMP
			WHERE invite_maintainer_for_community.id = invitation;

		INSERT INTO maintainer_for_community
			VALUES (account, invitation_row.community);

	END IF;

	RETURN QUERY
		SELECT
			community.id,
			community.name,
			community.slug
		FROM
			community
		WHERE
			community.id = invitation_row.community;
	RETURN;
END
$$;


-- SOFTWARE FOR COMMUNITY
-- request status of software to be added to community
-- default value is pending
CREATE TYPE request_status AS ENUM (
	'pending',
	'approved',
	'rejected'
);

CREATE TABLE software_for_community (
	software UUID REFERENCES software (id),
	community UUID REFERENCES community (id),
	status request_status NOT NULL DEFAULT 'pending',
	PRIMARY KEY (software, community)
);

CREATE FUNCTION sanitise_update_software_for_community() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.software = OLD.software;
	NEW.community = OLD.community;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software_for_community BEFORE UPDATE ON software_for_community FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software_for_community();
