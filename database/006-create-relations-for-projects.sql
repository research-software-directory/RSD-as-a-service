CREATE TABLE software_for_project (
	software UUID references software (id),
	project UUID references project (id),
	PRIMARY KEY (software, project)
);



CREATE TABLE project_for_project (
	origin UUID references project (id),
	relation UUID references project (id),
	PRIMARY KEY (origin, relation)
);
