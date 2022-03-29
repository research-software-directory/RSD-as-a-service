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
CREATE FUNCTION count_software_countributors() RETURNS TABLE (software UUID, contributor_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		contributor.software, COUNT(contributor.id) AS contributor_cnt
	FROM
		contributor
	GROUP BY
		contributor.software;
END
$$;

-- COUNT mentions per software
CREATE FUNCTION count_software_mentions() RETURNS TABLE (software UUID, mention_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		mention_for_software.software, COUNT(mention) AS mention_cnt
	FROM
		mention_for_software
	GROUP BY
		mention_for_software.software;
END
$$;

-- JOIN contributors and mentions counts per software
CREATE FUNCTION count_software_contributors_mentions() RETURNS TABLE (id UUID, contributor_cnt BIGINT, mention_cnt BIGINT) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		software.id, count_software_countributors.contributor_cnt, count_software_mentions.mention_cnt
	FROM
		software
	LEFT JOIN
		count_software_countributors() AS count_software_countributors ON software.id=count_software_countributors.software
	LEFT JOIN
		count_software_mentions() AS count_software_mentions ON software.id=count_software_mentions.software;
END
$$;

-- Software maintainer by software slug
CREATE FUNCTION maintainer_for_software_by_slug() RETURNS TABLE (maintainer UUID, software UUID, slug VARCHAR) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY SELECT
		maintainer_for_software.maintainer, maintainer_for_software.software, software.slug
	FROM
		maintainer_for_software
	LEFT JOIN
		software ON software.id = maintainer_for_software.software;
END
$$;

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
