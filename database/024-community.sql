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

	IF NOT NEW.is_tenant AND NEW.parent IS NULL AND NEW.primary_maintainer IS NULL THEN
		RETURN NEW;
	END IF;

	IF (SELECT primary_maintainer FROM community o WHERE o.id = NEW.parent) = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
	AND
	NEW.primary_maintainer = (SELECT primary_maintainer FROM community o WHERE o.id = NEW.parent)
	THEN
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

	IF CURRENT_USER <> 'rsd_admin' AND NOT (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		IF NEW.primary_maintainer IS DISTINCT FROM OLD.primary_maintainer THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the primary maintainer for community ' || OLD.name;
		END IF;
	END IF;

	RETURN NEW;
END
$$;

CREATE TRIGGER sanitise_update_community BEFORE UPDATE ON community FOR EACH ROW EXECUTE PROCEDURE sanitise_update_community();

-- RLS community table
ALTER TABLE community ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON community FOR SELECT TO rsd_web_anon, rsd_user
	USING (TRUE);

CREATE POLICY admin_all_rights ON community TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);


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


-- MAINTAINER OF COMMUNITY

CREATE TABLE maintainer_for_community (
	maintainer UUID REFERENCES account (id),
	community UUID REFERENCES community (id),
	PRIMARY KEY (maintainer, community)
);

-- INVITES FOR COMMUNITY MAINTAINER (magic link)
CREATE TABLE invite_maintainer_for_community (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	community UUID REFERENCES community (id) NOT NULL,
	created_by UUID REFERENCES account (id),
	claimed_by UUID REFERENCES account (id),
	claimed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT LOCALTIMESTAMP
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
	NEW.software = OLD.software;
	NEW.created_by = OLD.created_by;
	NEW.created_at = OLD.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_invite_maintainer_for_community BEFORE UPDATE ON invite_maintainer_for_community FOR EACH ROW EXECUTE PROCEDURE sanitise_update_invite_maintainer_for_community();

CREATE FUNCTION accept_invitation_community(invitation UUID) RETURNS TABLE(
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

	SELECT * FROM invite_maintainer_for_community WHERE id = invitation INTO invitation_row;
	IF invitation_row.id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' does not exist';
	END IF;

	IF invitation_row.claimed_by IS NOT NULL OR invitation_row.claimed_at IS NOT NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' is expired';
	END IF;

-- Only use the invitation if not already a maintainer
	IF NOT EXISTS(SELECT 1 FROM maintainer_for_community WHERE maintainer = account AND community = invitation_row.community) THEN
		UPDATE invite_maintainer_for_community SET claimed_by = account, claimed_at = LOCALTIMESTAMP WHERE id = invitation;
		INSERT INTO maintainer_for_community VALUES (account, invitation_row.community);
	END IF;

	RETURN QUERY
		SELECT community.name, community.slug FROM community WHERE community.id = invitation_row.community;
	RETURN;
END
$$;

