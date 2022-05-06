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


-- create table for maintainer's "magic link" invitations
CREATE TABLE invite_maintainer_for_project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	project UUID REFERENCES project (id) NOT NULL,
	created_by UUID REFERENCES account (id),
	claimed_by UUID REFERENCES account (id),
	claimed_at TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
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

	IF invitation_row.claimed_by IS NOT NULL OR invitation_row.claimed_at IS NOT NULL THEN
		RAISE EXCEPTION USING MESSAGE = 'Invitation with id ' || invitation || ' is expired';
	END IF;

	UPDATE invite_maintainer_for_project SET claimed_by = account WHERE id = invitation;
	INSERT INTO maintainer_for_project VALUES (account, invitation_row.project) ON CONFLICT DO NOTHING;

	RETURN QUERY
		SELECT project.title, project.slug FROM project WHERE project.id = invitation_row.project;
	RETURN;
END
$$;
