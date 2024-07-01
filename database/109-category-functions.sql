-- SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION delete_community_categories_from_software(software_id UUID, community_id UUID)
RETURNS VOID
LANGUAGE sql AS
$$
DELETE FROM category_for_software
	USING category
	WHERE category_for_software.category_id = category.id AND category_for_software.software_id = software_id AND category.community = community_id;
$$;
