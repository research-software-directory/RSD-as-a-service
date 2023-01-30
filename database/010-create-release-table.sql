-- SPDX-FileCopyrightText: 2021 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE release (
	software UUID REFERENCES software (id) PRIMARY KEY,
	releases_scraped_at TIMESTAMPTZ
);


CREATE TABLE release_version (
	release_id UUID REFERENCES release (software),
	mention_id UUID REFERENCES mention (id),
	PRIMARY KEY (release_id, mention_id)
);


CREATE FUNCTION software_join_release() RETURNS TABLE (
	software_id UUID,
	slug VARCHAR,
	concept_doi CITEXT,
	versioned_dois CITEXT[],
	releases_scraped_at TIMESTAMPTZ
) LANGUAGE plpgsql STABLE AS
$$
BEGIN
	RETURN QUERY
		SELECT software.id AS software_id, software.slug, software.concept_doi, ARRAY_AGG(mention.doi), release.releases_scraped_at
		FROM software
		LEFT JOIN release ON software.id = release.software
		LEFT JOIN release_version ON release_version.release_id = release.software
		LEFT JOIN mention ON release_version.mention_id = mention.id
		GROUP BY software.id, software.slug, software.concept_doi, release.software, release.releases_scraped_at;
	RETURN;
END
$$;
