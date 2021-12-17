CREATE TYPE topic as ENUM (
	'Astronomy',
	'Chemistry',
	'Climate and weather',
	'Computer science',
	'Ecology',
	'Health',
	'Humanities',
	'Law',
	'Life science',
	'Material science',
	'Physics',
	'Psychology',
	'Social sciences'
);

CREATE TABLE topic_for_project (
	project UUID references project (id),
	topic topic,
	PRIMARY KEY (project, topic)
);

CREATE TABLE tag_for_project (
	project UUID references project (id),
	tag tag,
	PRIMARY KEY (project, tag)
);
