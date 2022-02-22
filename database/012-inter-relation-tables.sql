CREATE TYPE relation_status as ENUM (
	'requested_by_origin',
	'requested_by_relation',
	'approved'
);

CREATE TABLE software_for_software (
	origin UUID references software (id),
	relation UUID references software (id),
	PRIMARY KEY (origin, relation)
);

CREATE FUNCTION sanitise_update_software_for_software() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.origin = OLD.origin;
	NEW.relation = OLD.relation;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software_for_software BEFORE UPDATE ON software_for_software FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software_for_software();


CREATE TABLE software_for_project (
	software UUID references software (id),
	project UUID references project (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (software, project)
);

CREATE FUNCTION sanitise_update_software_for_project() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.software = OLD.software;
	NEW.project = OLD.project;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software_for_project BEFORE UPDATE ON software_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software_for_project();


CREATE TABLE project_for_project (
	origin UUID references project (id),
	relation UUID references project (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (origin, relation)
);

CREATE FUNCTION sanitise_update_project_for_project() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.origin = OLD.origin;
	NEW.relation = OLD.relation;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_project_for_project BEFORE UPDATE ON project_for_project FOR EACH ROW EXECUTE PROCEDURE sanitise_update_project_for_project();


CREATE TABLE software_for_organisation (
	software UUID references software (id),
	organisation UUID references organisation (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (software, organisation)
);

CREATE FUNCTION sanitise_update_software_for_organisation() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.software = OLD.software;
	NEW.organisation = OLD.organisation;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_software_for_organisation BEFORE UPDATE ON software_for_organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_update_software_for_organisation();


CREATE TABLE project_for_organisation (
	project UUID references project (id),
	organisation UUID references organisation (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (project, organisation)
);

CREATE FUNCTION sanitise_update_project_for_organisation() RETURNS TRIGGER LANGUAGE plpgsql as
$$
BEGIN
	NEW.project = OLD.project;
	NEW.organisation = OLD.organisation;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_project_for_organisation BEFORE UPDATE ON project_for_organisation FOR EACH ROW EXECUTE PROCEDURE sanitise_update_project_for_organisation();
