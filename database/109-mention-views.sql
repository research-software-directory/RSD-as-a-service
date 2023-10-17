-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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
	WHERE mention.id IN (
		SELECT mention FROM reference_paper_for_software
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
)LANGUAGE sql STABLE AS
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
