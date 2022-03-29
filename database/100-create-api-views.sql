-- count of software per tag
CREATE FUNCTION count_software_per_tag() RETURNS TABLE (count BIGINT, tag tag) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		COUNT(*),
		tag_for_software.tag
	FROM
		tag_for_software
	JOIN software ON
		tag_for_software.software = software.id
	GROUP BY
		tag_for_software.tag;
END
$$;

-- COUNT contributors per software
CREATE VIEW count_software_countributors AS
SELECT
	software, count(contributor.id) AS contributor_cnt
FROM
	contributor
GROUP BY
	software
;

-- COUNT mentions per software
CREATE VIEW count_software_mentions AS
SELECT
	software, count(mention) AS mention_cnt
FROM
	mention_for_software
GROUP BY
	software
;

-- JOIN contributors and mentions counts per software
CREATE VIEW count_software_contributors_mentions AS
SELECT
	software.id, contributor_cnt, mention_cnt FROM software
LEFT JOIN
	count_software_countributors ON software.id=count_software_countributors.software
LEFT JOIN
	count_software_mentions ON software.id=count_software_mentions.software
WHERE
	software.is_published
;

-- Software maintainer by software slug
CREATE VIEW maintainer_for_software_by_slug AS
SELECT
	maintainer,software,slug from maintainer_for_software
LEFT JOIN
	software ON software.id=maintainer_for_software.software
;

-- UNIQUE contributor display_names
CREATE VIEW unique_countributors AS
SELECT distinct
	(CONCAT(given_names,' ',family_names)) AS display_name, affiliation, orcid, given_names, family_names, email_address, avatar_mime_type
FROM
	contributor
ORDER BY
	display_name asc
;

-- Participating organisations by software
CREATE VIEW organisations_for_software AS
SELECT
	organisation.id AS id,
	organisation.slug,
	organisation.primary_maintainer,
	organisation.name,
	organisation.ror_id,
	organisation.is_tenant,
	organisation.website,
	logo_for_organisation.id AS logo_id,
	software_for_organisation.status,
	software.id AS software
FROM
	software
INNER JOIN
	software_for_organisation ON software.id=software
INNER JOIN
	organisation ON software_for_organisation.organisation = organisation.id
LEFT JOIN
	logo_for_organisation ON logo_for_organisation.id = organisation.id;

-- Software count by organisation
CREATE VIEW software_count_by_organisation AS
SELECT
	organisation, count(organisation) AS software_cnt
FROM
	software_for_organisation
GROUP BY organisation;

-- Organisations overview
CREATE VIEW organisations_overview AS
SELECT
	organisation.id AS id,slug,name,website,ror_id,logo_for_organisation.id AS logo_id,software_cnt
FROM
	organisation
LEFT JOIN
	software_count_by_organisation ON organisation = organisation.id
LEFT JOIN
	logo_for_organisation ON organisation.id = logo_for_organisation.id;
