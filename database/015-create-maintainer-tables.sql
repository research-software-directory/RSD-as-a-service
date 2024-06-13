-- SPDX-FileCopyrightText: 2021 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2024 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 dv4all
-- SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE maintainer_for_software (
	maintainer UUID REFERENCES account (id),
	software UUID REFERENCES software (id),
	PRIMARY KEY (maintainer, software)
);

CREATE TABLE maintainer_for_project (
	maintainer UUID REFERENCES account (id),
	project UUID REFERENCES project (id),
	PRIMARY KEY (maintainer, project)
);

CREATE TABLE maintainer_for_organisation (
	maintainer UUID REFERENCES account (id),
	organisation UUID REFERENCES organisation (id),
	PRIMARY KEY (maintainer, organisation)
);

-- PROJECT
-- create table for maintainer's "magic link" invitations
CREATE TABLE invite_maintainer_for_project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	project UUID REFERENCES project (id) NOT NULL,
	created_by UUID REFERENCES account (id),
	claimed_by UUID REFERENCES account (id),
	claimed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT LOCALTIMESTAMP,
	expires_at TIMESTAMPTZ NOT NULL GENERATED ALWAYS AS (created_at AT TIME ZONE 'UTC' + INTERVAL '31 days') STORED
);

CREATE FUNCTION sanitise_insert_invite_maintainer_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.claimed_by = NULL;
	NEW.claimed_at = NULL;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_invite_maintainer_for_project BEFORE INSERT ON invite_maintainer_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_invite_maintainer_for_project();


CREATE FUNCTION sanitise_update_invite_maintainer_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.project = OLD.project;
	NEW.created_by = OLD.created_by;
	NEW.created_at = OLD.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_invite_maintainer_for_project BEFORE UPDATE ON invite_maintainer_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_invite_maintainer_for_project();


CREATE FUNCTION accept_invitation_project(invitation UUID) RETURNS TABLE(title VARCHAR, slug VARCHAR) LANGUAGE plpgsql VOLATILE SECURITY DEFINER AS
$$
DECLARE invitation_row invite_maintainer_for_project%ROWTYPE;
DECLARE account UUID;
BEGIN
	account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	IF account IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please login first';
	END IF;

	IF invitation IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide an invitation id';
	END IF;

	SELECT * FROM invite_maintainer_for_project WHERE id = invitation INTO invitation_row;
	IF invitation_row.id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' does not exist';
	END IF;

	IF invitation_row.claimed_by IS NOT NULL OR invitation_row.claimed_at IS NOT NULL OR invitation_row.expires_at < CURRENT_TIMESTAMP THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' is expired';
	END IF;

-- Only use the invitation if not already a maintainer
	IF NOT EXISTS(SELECT 1 FROM maintainer_for_project WHERE maintainer = account AND project = invitation_row.project) THEN
		UPDATE invite_maintainer_for_project SET claimed_by = account, claimed_at = LOCALTIMESTAMP WHERE id = invitation;
		INSERT INTO maintainer_for_project VALUES (account, invitation_row.project);
	END IF;

	RETURN QUERY
		SELECT project.title, project.slug FROM project WHERE project.id = invitation_row.project;
	RETURN;
END
$$;

-- SOFTWARE
-- create tables and rpc for maintainer's "magic link" invitations
CREATE TABLE invite_maintainer_for_software (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	software UUID REFERENCES software (id) NOT NULL,
	created_by UUID REFERENCES account (id),
	claimed_by UUID REFERENCES account (id),
	claimed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT LOCALTIMESTAMP,
	expires_at TIMESTAMPTZ NOT NULL GENERATED ALWAYS AS (created_at AT TIME ZONE 'UTC' + INTERVAL '31 days') STORED
);

CREATE FUNCTION sanitise_insert_invite_maintainer_for_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.claimed_by = NULL;
	NEW.claimed_at = NULL;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_invite_maintainer_for_software BEFORE INSERT ON invite_maintainer_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_invite_maintainer_for_software();


CREATE FUNCTION sanitise_update_invite_maintainer_for_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.software = OLD.software;
	NEW.created_by = OLD.created_by;
	NEW.created_at = OLD.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_invite_maintainer_for_software BEFORE UPDATE ON invite_maintainer_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_invite_maintainer_for_software();


CREATE FUNCTION accept_invitation_software(invitation UUID) RETURNS TABLE(
	brand_name VARCHAR,
	slug VARCHAR
) LANGUAGE plpgsql VOLATILE SECURITY DEFINER AS
$$
DECLARE invitation_row invite_maintainer_for_software%ROWTYPE;
DECLARE account UUID;
BEGIN
	account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	IF account IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please login first';
	END IF;

	IF invitation IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide an invitation id';
	END IF;

	SELECT * FROM invite_maintainer_for_software WHERE id = invitation INTO invitation_row;
	IF invitation_row.id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' does not exist';
	END IF;

	IF invitation_row.claimed_by IS NOT NULL OR invitation_row.claimed_at IS NOT NULL OR invitation_row.expires_at < CURRENT_TIMESTAMP THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' is expired';
	END IF;

-- Only use the invitation if not already a maintainer
	IF NOT EXISTS(SELECT 1 FROM maintainer_for_software WHERE maintainer = account AND software = invitation_row.software) THEN
		UPDATE invite_maintainer_for_software SET claimed_by = account, claimed_at = LOCALTIMESTAMP WHERE id = invitation;
		INSERT INTO maintainer_for_software VALUES (account, invitation_row.software);
	END IF;

	RETURN QUERY
		SELECT software.brand_name, software.slug FROM software WHERE software.id = invitation_row.software;
	RETURN;
END
$$;

-- ORGANISATION
-- create tables and rpc for maintainer's "magic link" invitations
CREATE TABLE invite_maintainer_for_organisation (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	organisation UUID REFERENCES organisation (id) NOT NULL,
	created_by UUID REFERENCES account (id),
	claimed_by UUID REFERENCES account (id),
	claimed_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT LOCALTIMESTAMP,
	expires_at TIMESTAMPTZ NOT NULL GENERATED ALWAYS AS (created_at AT TIME ZONE 'UTC' + INTERVAL '31 days') STORED
);

CREATE FUNCTION sanitise_insert_invite_maintainer_for_organisation() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.claimed_by = NULL;
	NEW.claimed_at = NULL;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_invite_maintainer_for_organisation BEFORE INSERT ON invite_maintainer_for_organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_invite_maintainer_for_organisation();


CREATE FUNCTION sanitise_update_invite_maintainer_for_organisation() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.organisation = OLD.organisation;
	NEW.created_by = OLD.created_by;
	NEW.created_at = OLD.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_invite_maintainer_for_organisation BEFORE UPDATE ON invite_maintainer_for_organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_update_invite_maintainer_for_organisation();


CREATE FUNCTION accept_invitation_organisation(invitation UUID) RETURNS TABLE(
	id UUID,
	name VARCHAR
) LANGUAGE plpgsql VOLATILE SECURITY DEFINER AS
$$
DECLARE invitation_row invite_maintainer_for_organisation%ROWTYPE;
DECLARE account UUID;
BEGIN
	account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account');
	IF account IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please login first';
	END IF;

	IF invitation IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide an invitation id';
	END IF;

	SELECT * FROM invite_maintainer_for_organisation WHERE invite_maintainer_for_organisation.id = invitation INTO invitation_row;
	IF invitation_row.id IS NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' does not exist';
	END IF;

	IF invitation_row.claimed_by IS NOT NULL OR invitation_row.claimed_at IS NOT NULL OR invitation_row.expires_at < CURRENT_TIMESTAMP THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' is expired';
	END IF;

-- Only use the invitation if not already a maintainer
	IF NOT EXISTS(
		SELECT
			maintainer_for_organisation.maintainer
		FROM
			maintainer_for_organisation
		WHERE
			maintainer_for_organisation.maintainer=account AND maintainer_for_organisation.organisation=invitation_row.organisation
		UNION
		SELECT
			organisation.primary_maintainer AS maintainer
		FROM
			organisation
		WHERE
			organisation.primary_maintainer=account AND organisation.id=invitation_row.organisation
		LIMIT 1
	) THEN
		UPDATE invite_maintainer_for_organisation SET claimed_by = account, claimed_at = LOCALTIMESTAMP WHERE invite_maintainer_for_organisation.id = invitation;
		INSERT INTO maintainer_for_organisation VALUES (account, invitation_row.organisation);
	END IF;

	RETURN QUERY
		SELECT
			organisation.id,
			organisation.name
		FROM
			organisation
		WHERE
			organisation.id = invitation_row.organisation;
	RETURN;
END
$$;
