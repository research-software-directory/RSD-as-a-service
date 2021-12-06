CREATE TABLE software_for_project (
	software UUID references software (id),
	project UUID references project (id),
	PRIMARY KEY (software, project)
);
