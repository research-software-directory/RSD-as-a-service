-- SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 dv4all
-- SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE team_member (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	project UUID REFERENCES project (id) NOT NULL,
	is_contact_person BOOLEAN NOT NULL DEFAULT FALSE,
	email_address VARCHAR(200),
	family_names VARCHAR(200) NOT NULL,
	given_names VARCHAR(200) NOT NULL,
	affiliation VARCHAR(200) CHECK (affiliation ~ '^\S+( \S+)*$'),
	role VARCHAR(200) CHECK (role ~ '^\S+( \S+)*$'),
	orcid VARCHAR(19) CHECK (orcid ~ '^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$'),
	position INTEGER,
	avatar_id VARCHAR(40) REFERENCES image(id),
	-- support for (loosely) linking of user_profile entry without ORCID
	account UUID REFERENCES account (id),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX team_member_project_idx ON team_member(project);
CREATE INDEX team_member_orcid_idx ON team_member(orcid);
CREATE INDEX team_member_account_idx ON team_member(account);

CREATE FUNCTION sanitise_insert_team_member() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_team_member BEFORE INSERT ON team_member FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_team_member();


CREATE FUNCTION sanitise_update_team_member() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	IF OLD.account IS NOT NULL AND (CURRENT_USER = 'rsd_admin' OR (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER)) IS DISTINCT FROM TRUE THEN
		NEW.family_names = OLD.family_names;
		NEW.given_names = OLD.given_names;
		NEW.orcid = OLD.orcid;
	END IF;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_team_member BEFORE UPDATE ON team_member FOR EACH ROW EXECUTE PROCEDURE sanitise_update_team_member();


CREATE TABLE testimonial_for_project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	project UUID REFERENCES project (id) NOT NULL,
	message VARCHAR(500) NOT NULL,
	source VARCHAR(200) NOT NULL,
	position INTEGER
);

CREATE INDEX testimonial_for_project_project_idx ON testimonial_for_project(project);

CREATE FUNCTION sanitise_insert_testimonial_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_testimonial_for_project BEFORE INSERT ON testimonial_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_testimonial_for_project();


CREATE FUNCTION sanitise_update_testimonial_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_testimonial_for_project BEFORE UPDATE ON testimonial_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_testimonial_for_project();
