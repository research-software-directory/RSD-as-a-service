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
