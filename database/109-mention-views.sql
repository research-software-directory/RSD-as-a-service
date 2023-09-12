-- SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION mentions_to_scrape()
RETURNS TABLE (
	id UUID,
	doi CITEXT,
	citations_scraped_at TIMESTAMPTZ
)
LANGUAGE sql STABLE AS
$$
	SELECT id, doi, citations_scraped_at
	FROM mention
	WHERE id IN (
		SELECT mention FROM reference_paper_for_software
	)
$$;
