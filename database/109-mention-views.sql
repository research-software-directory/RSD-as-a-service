-- SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION reference_papers_to_scrape()
RETURNS TABLE (
	id UUID,
	doi CITEXT,
	citations_scraped_at TIMESTAMPTZ,
	known_dois CITEXT[]
)
LANGUAGE sql STABLE AS
$$
	SELECT mention.id, mention.doi, mention.citations_scraped_at, ARRAY_REMOVE(ARRAY_AGG(citation.doi), NULL)
	FROM mention
	LEFT JOIN citation_for_mention ON mention.id = citation_for_mention.mention
	LEFT JOIN mention AS citation ON citation_for_mention.citation = citation.id
	WHERE
	-- ONLY items with DOI
		mention.doi IS NOT NULL AND (
			mention.id IN (
				SELECT mention FROM reference_paper_for_software
			)
			OR
			mention.id IN (
				SELECT mention FROM output_for_project
			)
		)
	GROUP BY mention.id
$$;

-- UNIQUE CITATIONS BY SOFTWARE ID
CREATE FUNCTION citation_by_software() RETURNS TABLE (
	software UUID,
	id UUID,
	doi CITEXT,
	url VARCHAR,
	title VARCHAR,
	authors VARCHAR,
	publisher VARCHAR,
	publication_year SMALLINT,
	journal VARCHAR,
	page VARCHAR,
	image_url VARCHAR,
	mention_type mention_type,
	source VARCHAR,
	reference_papers UUID[]
) LANGUAGE sql STABLE AS
$$
SELECT
	reference_paper_for_software.software,
	mention.id,
	mention.doi,
	mention.url,
	mention.title,
	mention.authors,
	mention.publisher,
	mention.publication_year,
	mention.journal,
	mention.page,
	mention.image_url,
	mention.mention_type,
	mention.source,
	ARRAY_AGG(
		reference_paper_for_software.mention
	) AS reference_paper
FROM
	reference_paper_for_software
INNER JOIN
	citation_for_mention ON citation_for_mention.mention = reference_paper_for_software.mention
INNER JOIN
	mention ON mention.id = citation_for_mention.citation
GROUP BY
	reference_paper_for_software.software,
	mention.id,
	mention.doi,
	mention.url,
	mention.title,
	mention.authors,
	mention.publisher,
	mention.publication_year,
	mention.journal,
	mention.page,
	mention.image_url,
	mention.mention_type,
	mention.source
;
$$;

-- UNIQUE MENTIONS & CITATIONS BY SOFTWARE ID
-- UNION will deduplicate exact entries
CREATE FUNCTION mentions_by_software() RETURNS TABLE (
	software UUID,
	id UUID,
	doi CITEXT,
	url VARCHAR,
	title VARCHAR,
	authors VARCHAR,
	publisher VARCHAR,
	publication_year SMALLINT,
	journal VARCHAR,
	page VARCHAR,
	image_url VARCHAR,
	mention_type mention_type,
	source VARCHAR
) LANGUAGE sql STABLE AS
$$
-- mentions for software
SELECT
	mention_for_software.software,
	mention.id,
	mention.doi,
	mention.url,
	mention.title,
	mention.authors,
	mention.publisher,
	mention.publication_year,
	mention.journal,
	mention.page,
	mention.image_url,
	mention.mention_type,
	mention.source
FROM
	mention
INNER JOIN
	mention_for_software ON mention_for_software.mention = mention.id
-- will deduplicate identical entries
-- from scraped citations
UNION
-- scraped citations from reference papers
SELECT
	software,
	id,
	doi,
	url,
	title,
	authors,
	publisher,
	publication_year,
	journal,
	page,
	image_url,
	mention_type,
	source
FROM
	citation_by_software()
;
$$;
