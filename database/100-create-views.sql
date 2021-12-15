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