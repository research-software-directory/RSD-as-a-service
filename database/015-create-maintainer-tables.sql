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

CREATE TABLE maintainer_for_organisation (
	maintainer UUID references account (id),
	organisation UUID references organisation (id),
	PRIMARY KEY (maintainer, organisation)
);


-- create table for maintainer's "magic link" invitations
CREATE TABLE invite_maintainer_for_project (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	project UUID references project (id),
	created_by UUID references account(id),
	claimed_by UUID references account(id),
	claimed_at TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);
