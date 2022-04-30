-- install citex extension for
-- case insensitive indexing
-- https://www.postgresql.org/docs/current/citext.html
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE keyword (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	value CITEXT UNIQUE
);

CREATE TABLE keyword_for_project (
	project UUID references project (id),
	keyword UUID references keywords (id),
	PRIMARY KEY (project, keyword)
);

-- ADD basic keywords from topics and tags
INSERT into keyword (value)
VALUES
	('Astronomy'),
	('Chemistry'),
	('Climate and weather'),
	('Computer science'),
	('Ecology'),
	('Health'),
	('Humanities'),
	('Law'),
	('Life science'),
	('Material science'),
	('Physics'),
	('Psychology'),
	('Social sciences'),
	('Big data'),
	('GPU'),
	('High performance computing'),
	('Image processing'),
	('Inter-operability & linked data'),
	('Machine learning'),
	('Multi-scale & multi model simulations'),
	('Optimized data handling'),
	('Real time data analysis'),
	('Text analysis & natural language processing'),
	('Visualization'),
	('Workflow technologies')
;
