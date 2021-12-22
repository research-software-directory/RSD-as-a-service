CREATE TABLE maintainer_for_software (
	maintainer UUID references account (id),
	software UUID references software (id),
	PRIMARY KEY (maintainer, software)
);

CREATE TABLE maintainer_for_project (
	maintainer UUID references account (id),
	project UUID references project (id),
	PRIMARY KEY (maintainer, project)
);
