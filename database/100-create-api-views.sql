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
	software, count(mention) as mention_cnt
FROM
	mention_for_software
GROUP BY
	software
;

-- JOIN contributors and mentions counts per software
CREATE VIEW count_software_contributors_mentions AS
SELECT
	software.id, contributor_cnt, mention_cnt from software
LEFT JOIN
	count_software_countributors ON software.id=count_software_countributors.software
LEFT JOIN
	count_software_mentions on software.id=count_software_mentions.software
WHERE
	software.is_published
;

-- Software maintainer by software slug
CREATE VIEW maintainer_for_software_by_slug as
SELECT
	maintainer,software,slug from maintainer_for_software
LEFT JOIN
	software on software.id=maintainer_for_software.software
;

-- UNIQUE contributor display_names
CREATE VIEW unique_countributors as
SELECT distinct
	(CONCAT(given_names,' ',family_names)) as display_name, affiliation, orcid, given_names, family_names, email_address, avatar_mime_type
FROM
	contributor
ORDER BY
	display_name asc
;

-- Participating organisations by software
CREATE VIEW organisations_for_software AS
SELECT
	organisation.id as id,
	organisation.slug,
	organisation.primary_maintainer,
	organisation.name,
	organisation.ror_id,
	organisation.is_tenant,
	organisation.website,
	logo_for_organisation.id as logo_id,
	software_for_organisation.status,
	software.id as software
FROM
	software
INNER JOIN
	software_for_organisation on software.id=software
INNER JOIN
	organisation on software_for_organisation.organisation = organisation.id
LEFT JOIN
	logo_for_organisation on logo_for_organisation.id = organisation.id
;

-- Software count by organisation
CREATE VIEW software_count_by_organisation AS
SELECT
	organisation, count(organisation) as software_cnt
FROM
	software_for_organisation
GROUP BY organisation
;

-- Organisations overview
CREATE VIEW organisations_overview AS
SELECT
	organisation.id as id,slug,name,website,ror_id,logo_for_organisation.id as logo_id,software_cnt
FROM
	organisation
LEFT JOIN
	software_count_by_organisation on organisation = organisation.id
LEFT JOIN
	logo_for_organisation on organisation = logo_for_organisation.id
;
