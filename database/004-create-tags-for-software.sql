CREATE TYPE tag as ENUM (
	'Big data',
	'GPU',
	'High performance computing',
	'Image processing',
	'Inter-operability & linked data',
	'Machine learning',
	'Multi-scale & multi model simulations',
	'Optimized data handling',
	'Real time data analysis',
	'Text analysis & natural language processing',
	'Visualization',
	'Workflow technologies'
);

CREATE TABLE tag_for_software (
	software UUID references software (id),
	tag tag,
	PRIMARY KEY (software, tag)
);
