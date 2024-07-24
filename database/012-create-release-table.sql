-- SPDX-FileCopyrightText: 2021 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2024 Netherlands eScience Center
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

CREATE INDEX release_version_mention_id_idx ON release_version(mention_id);


CREATE FUNCTION z_delete_old_releases() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS
$$
BEGIN
	IF NEW.concept_doi IS DISTINCT FROM OLD.concept_doi THEN
		DELETE FROM release_version WHERE release_version.release_id = OLD.id;
		DELETE FROM release WHERE release.software = OLD.id;
	END IF;
	RETURN NEW;
END
$$;

CREATE TRIGGER z_delete_old_releases BEFORE UPDATE ON software FOR EACH ROW EXECUTE PROCEDURE z_delete_old_releases();


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
