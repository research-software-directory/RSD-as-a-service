-- count of software per tag
CREATE VIEW count_software_per_tag AS
SELECT
	count(*),
	tag
FROM
	tag_for_software
JOIN software ON
	tag_for_software.software = software.id
WHERE
	software.is_published
GROUP BY
	tag
;

-- COUNT contributors per software
CREATE VIEW count_software_countributors AS
SELECT
	software, count(contributor.id) as contributor_cnt
FROM
	contributor
GROUP BY
	software
;

-- COUNT mentions per software
CREATE VIEW count_software_mentions AS
SELECT
	software, count(mention) as mentions_cnt
FROM
	mention_for_software
GROUP BY
	software
;

-- JOIN contributors and mentions counts per software
CREATE VIEW count_software_contributors_mentions AS
SELECT
	software.id, contributor_cnt, mentions_cnt from software
LEFT JOIN
	count_software_countributors ON software.id=count_software_countributors.software
LEFT JOIN
	count_software_mentions on software.id=count_software_mentions.software
WHERE
	software.is_published
;
