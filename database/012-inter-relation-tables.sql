CREATE TYPE relation_status as ENUM (
	'requested_by_origin',
	'requested_by_relation',
	'approved'
);

CREATE TABLE software_for_software (
	origin UUID references software (id),
	relation UUID references software (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (origin, relation)
);


CREATE TABLE software_for_project (
	software UUID references software (id),
	project UUID references project (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (software, project)
);


CREATE TABLE project_for_project (
	origin UUID references project (id),
	relation UUID references project (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (origin, relation)
);


CREATE TABLE software_for_organisation (
	software UUID references software (id),
	organisation UUID references organisation (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (software, organisation)
);


CREATE TABLE project_for_organisation (
	project UUID references project (id),
	organisation UUID references organisation (id),
	status relation_status NOT NULL DEFAULT 'approved',
	PRIMARY KEY (project, organisation)
);
