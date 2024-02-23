-- SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION slug_from_log_reference(
	table_name VARCHAR,
	reference_id UUID
)
RETURNS VARCHAR
LANGUAGE sql STABLE AS
$$
SELECT CASE
	WHEN table_name = 'repository_url' THEN (
		SELECT
			CONCAT('/software/', slug, '/edit/information')
		FROM
			software WHERE id = reference_id
	)
	WHEN table_name = 'package_manager' THEN (
		SELECT
			CONCAT('/software/', slug, '/edit/package-managers')
		FROM
			software
		WHERE id = (SELECT software FROM package_manager WHERE id = reference_id))
	WHEN table_name = 'mention' AND reference_id IS NOT NULL THEN (
		SELECT
			CONCAT('/api/v1/mention?id=eq.', reference_id)
	)
	WHEN table_name = 'organisation' AND reference_id IS NOT NULL THEN (
		SELECT
			CONCAT('/organisations/', slug, '?tab=settings')
		FROM
			organisation
		WHERE id = reference_id
	)
	END
$$;

CREATE FUNCTION backend_log_view() RETURNS TABLE (
	id UUID,
	service_name VARCHAR,
	table_name VARCHAR,
	reference_id UUID,
	message VARCHAR,
	stack_trace VARCHAR,
	other_data JSONB,
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ,
	slug VARCHAR
)
LANGUAGE sql STABLE AS
$$
SELECT
	*,
	slug_from_log_reference(backend_log.table_name, backend_log.reference_id)
FROM
	backend_log
$$;
