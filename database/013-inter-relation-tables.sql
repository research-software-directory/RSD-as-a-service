-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TYPE relation_status AS ENUM (
	'rejected_by_origin',
	'rejected_by_relation',
	'approved'
);

CREATE TYPE organisation_role AS ENUM (
	'funding',
	'hosting',
	'participating'
);

CREATE TABLE software_for_software (
	origin UUID REFERENCES software (id),
	relation UUID REFERENCES software (id),
	PRIMARY KEY (origin, relation)
);

CREATE FUNCTION sanitise_update_software_for_software() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.origin = OLD.origin;
	NEW.relation = OLD.relation;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software_for_software BEFORE UPDATE ON software_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software_for_software();


CREATE TABLE software_for_project (
	software UUID REFERENCES software (id),
	project UUID REFERENCES project (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (software, project)
);

CREATE FUNCTION sanitise_update_software_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.software = OLD.software;
	NEW.project = OLD.project;

	IF CURRENT_USER <> 'rsd_admin' AND NOT (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		IF NEW.status <> OLD.status AND (
			(OLD.status = 'rejected_by_origin' AND (NEW.status <> 'approved' OR OLD.software NOT IN (SELECT * FROM software_of_current_maintainer()))) OR
			(OLD.status = 'rejected_by_relation' AND (NEW.status <> 'approved' OR OLD.project NOT IN (SELECT * FROM projects_of_current_maintainer()))) OR
			(OLD.status = 'approved' AND NEW.status = 'rejected_by_origin' AND OLD.software NOT IN (SELECT * FROM projects_of_current_maintainer())) OR
			(OLD.status = 'approved' AND NEW.status = 'rejected_by_relation' AND OLD.project NOT IN (SELECT * FROM software_of_current_maintainer()))
		) THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to make this change to the status value for software ' || OLD.software || ' and project ' || OLD.project;
		END IF;
	END IF;

	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software_for_project BEFORE UPDATE ON software_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software_for_project();


CREATE TABLE project_for_project (
	origin UUID REFERENCES project (id),
	relation UUID REFERENCES project (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (origin, relation)
);

CREATE FUNCTION sanitise_update_project_for_project() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.origin = OLD.origin;
	NEW.relation = OLD.relation;

	IF CURRENT_USER <> 'rsd_admin' AND NOT (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		IF NEW.status <> OLD.status AND (
			(OLD.status = 'rejected_by_origin' AND (NEW.status <> 'approved' OR OLD.origin NOT IN (SELECT * FROM projects_of_current_maintainer()))) OR
			(OLD.status = 'rejected_by_relation' AND (NEW.status <> 'approved' OR OLD.relation NOT IN (SELECT * FROM projects_of_current_maintainer()))) OR
			(OLD.status = 'approved' AND NEW.status = 'rejected_by_origin' AND OLD.origin NOT IN (SELECT * FROM projects_of_current_maintainer())) OR
			(OLD.status = 'approved' AND NEW.status = 'rejected_by_relation' AND OLD.relation NOT IN (SELECT * FROM projects_of_current_maintainer()))
		) THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to make this change to the status value for origin ' || OLD.origin || ' and relation ' || OLD.relation;
		END IF;
	END IF;

	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_project_for_project BEFORE UPDATE ON project_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_project_for_project();


CREATE TABLE software_for_organisation (
	software UUID REFERENCES software (id),
	organisation UUID REFERENCES organisation (id),
	status relation_status NOT NULL DEFAULT 'approved',
	is_featured BOOLEAN DEFAULT FALSE NOT NULL,
	position INTEGER,
	PRIMARY KEY (software, organisation)
);

CREATE FUNCTION sanitise_update_software_for_organisation() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.software = OLD.software;
	NEW.organisation = OLD.organisation;

	IF CURRENT_USER <> 'rsd_admin' AND NOT (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		IF NEW.is_featured <> OLD.is_featured AND OLD.organisation NOT IN (SELECT * FROM organisations_of_current_maintainer()) THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the is_featured value for software ' || OLD.software || 'and organisation ' || OLD.organisation;
		END IF;
		IF NEW.status <> OLD.status AND (
			(OLD.status = 'rejected_by_origin' AND (NEW.status <> 'approved' OR OLD.software NOT IN (SELECT * FROM software_of_current_maintainer()))) OR
			(OLD.status = 'rejected_by_relation' AND (NEW.status <> 'approved' OR OLD.organisation NOT IN (SELECT * FROM organisations_of_current_maintainer()))) OR
			(OLD.status = 'approved' AND NEW.status = 'rejected_by_origin' AND OLD.software NOT IN (SELECT * FROM software_of_current_maintainer())) OR
			(OLD.status = 'approved' AND NEW.status = 'rejected_by_relation' AND OLD.organisation NOT IN (SELECT * FROM organisations_of_current_maintainer()))
		) THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to make this change to the status value for software ' || OLD.software || ' and organisation ' || OLD.organisation;
		END IF;
	END IF;

	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software_for_organisation BEFORE UPDATE ON software_for_organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software_for_organisation();


CREATE TABLE project_for_organisation (
	project UUID REFERENCES project (id),
	organisation UUID REFERENCES organisation (id),
	status relation_status NOT NULL DEFAULT 'approved',
	role organisation_role NOT NULL DEFAULT 'participating',
	is_featured BOOLEAN DEFAULT FALSE NOT NULL,
	position INTEGER,
	PRIMARY KEY (project, organisation, role)
);

CREATE FUNCTION sanitise_update_project_for_organisation() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.project = OLD.project;
	NEW.organisation = OLD.organisation;

	IF CURRENT_USER <> 'rsd_admin' AND NOT (SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) THEN
		IF NEW.is_featured <> OLD.is_featured AND OLD.organisation NOT IN (SELECT * FROM organisations_of_current_maintainer()) THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to change the is_featured value for project ' || OLD.project || 'and organisation ' || OLD.organisation;
		END IF;
		IF NEW.status <> OLD.status AND (
			(OLD.status = 'rejected_by_origin' AND (NEW.status <> 'approved' OR OLD.project NOT IN (SELECT * FROM projects_of_current_maintainer()))) OR
			(OLD.status = 'rejected_by_relation' AND (NEW.status <> 'approved' OR OLD.organisation NOT IN (SELECT * FROM organisations_of_current_maintainer()))) OR
			(OLD.status = 'approved' AND NEW.status = 'rejected_by_origin' AND OLD.project NOT IN (SELECT * FROM projects_of_current_maintainer())) OR
			(OLD.status = 'approved' AND NEW.status = 'rejected_by_relation' AND OLD.organisation NOT IN (SELECT * FROM organisations_of_current_maintainer()))
		) THEN
			RAISE EXCEPTION USING MESSAGE = 'You are not allowed to make this change to the status value for project ' || OLD.project || ' and organisation ' || OLD.organisation;
		END IF;
	END IF;

	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_project_for_organisation BEFORE UPDATE ON project_for_organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_update_project_for_organisation();
