-- SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE FUNCTION nassa_import(
	slug VARCHAR(200),
	brand_name VARCHAR(200),
	description VARCHAR(10000),
	short_statement VARCHAR(300),
	get_started_url VARCHAR(200),
	repository_url VARCHAR(200),
	license_value VARCHAR(100),
	license_name VARCHAR(200),
	license_url VARCHAR(200),
	license_open_source BOOLEAN,
	related_modules VARCHAR[],
	family_names_array VARCHAR[],
	given_names_array VARCHAR[],
	role_array VARCHAR[],
	orcid_array VARCHAR[],
	position_array INTEGER[],
	categories JSONB,
	regular_mentions JSONB
)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
AS
$$
DECLARE software_id UUID;
DECLARE related_software_slug VARCHAR;
DECLARE related_software_id UUID;
DECLARE nassa_id UUID;
DECLARE category_value TEXT;
DECLARE category_id UUID;
DECLARE top_level_category_value TEXT;
DECLARE top_level_category_id UUID;
DECLARE mention_entry JSONB;
DECLARE mention_id UUID;

BEGIN
	IF
		(SELECT rolsuper FROM pg_roles WHERE rolname = SESSION_USER) IS DISTINCT FROM TRUE
		AND
		(SELECT CURRENT_SETTING('request.jwt.claims', FALSE)::json->>'role') IS DISTINCT FROM 'rsd_admin'
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to import NASSA software';
	END IF;

	SELECT id FROM community WHERE community.slug = 'nassa' INTO nassa_id;
	IF nassa_id IS NULL
	THEN
		RAISE EXCEPTION USING MESSAGE = 'The NASSA community does not exist yet';
	END IF;

	IF
		ARRAY_LENGTH(family_names_array, 1) IS DISTINCT FROM ARRAY_LENGTH(given_names_array, 1)
		OR
		ARRAY_LENGTH(given_names_array, 1) IS DISTINCT FROM ARRAY_LENGTH(role_array, 1)
		OR
		ARRAY_LENGTH(role_array, 1) IS DISTINCT FROM ARRAY_LENGTH(orcid_array, 1)
		OR
		ARRAY_LENGTH(orcid_array, 1) IS DISTINCT FROM ARRAY_LENGTH(position_array, 1)
	THEN
		RAISE EXCEPTION USING MESSAGE = 'The contributor arrays should have the same length';
	END IF;

	INSERT INTO software (
		slug,
		is_published,
		brand_name,
		description,
		short_statement,
		get_started_url
	) VALUES (
		nassa_import.slug,
		TRUE,
		nassa_import.brand_name,
		nassa_import.description,
		nassa_import.short_statement,
		nassa_import.get_started_url
	)
	ON CONFLICT ((software.slug)) DO UPDATE SET
		brand_name = EXCLUDED.brand_name,
		description = EXCLUDED.description,
		short_statement = EXCLUDED.short_statement,
		get_started_url = EXCLUDED.get_started_url
	RETURNING software.id INTO software_id;

	INSERT INTO software_for_community (software, community, status) VALUES (software_id, nassa_id, 'approved') ON CONFLICT DO NOTHING;

	INSERT INTO repository_url (
		software,
		url,
		code_platform,
		scraping_disabled_reason
	) VALUES (
		software_id,
		nassa_import.repository_url,
		'github',
		'This is a NASSA module which is not a repository root'
	)
	ON CONFLICT DO NOTHING;

	DELETE FROM license_for_software WHERE license_for_software.software = software_id;
	IF license_value IS NOT NULL
	THEN
		INSERT INTO license_for_software (
			software,
			license,
			name,
			reference,
			open_source
		) VALUES (
			software_id,
			license_value,
			license_name,
			license_url,
			license_open_source
		);
	END IF;

	IF related_modules IS NOT NULL
	THEN
		FOREACH related_software_slug IN ARRAY related_modules LOOP
			SELECT software.id FROM software WHERE software.slug = related_software_slug INTO related_software_id;
			IF related_software_id IS NOT NULL
			THEN
				INSERT INTO software_for_software (origin, relation) VALUES (software_id, related_software_id) ON CONFLICT DO NOTHING;
			END IF;
		END LOOP;
	END IF;

	-- contributors
	FOR i IN 1..ARRAY_LENGTH(family_names_array, 1) LOOP
		IF
			orcid_array[i] IS NOT NULL
			AND
			(SELECT COUNT(*) FROM contributor WHERE contributor.software = software_id AND contributor.orcid = orcid_array[i]) = 1
		THEN
			UPDATE contributor SET
				family_names = family_names_array[i],
				given_names = given_names_array[i],
				role = role_array[i],
				position = position_array[i]
			WHERE
				contributor.software = software_id AND contributor.orcid = orcid_array[i];
		ELSEIF (SELECT COUNT(*) FROM contributor WHERE contributor.software = software_id AND contributor.family_names = family_names_array[i] AND contributor.given_names = given_names_array[i]) = 1
		THEN
			UPDATE contributor SET
				role = role_array[i],
				orcid = orcid_array[i],
				position = position_array[i]
			WHERE
				contributor.software = software_id AND contributor.family_names = family_names_array[i] AND contributor.given_names = given_names_array[i];
		ELSE
			INSERT INTO contributor (
				software,
				family_names,
				given_names,
				role,
				orcid,
				position
			) VALUES (
				software_id,
				family_names_array[i],
				given_names_array[i],
				role_array[i],
				orcid_array[i],
				position_array[i]
			);
		END IF;

	END LOOP;
	-- end contributors

	-- categories
	FOR top_level_category_value IN (SELECT JSONB_OBJECT_KEYS(categories)) LOOP
		SELECT id FROM category WHERE community = nassa_id AND name = top_level_category_value INTO top_level_category_id;
		IF top_level_category_id IS NULL
		THEN
			INSERT INTO category (
				community,
				short_name,
				name
			)
			VALUES (
				nassa_id,
				top_level_category_value,
				top_level_category_value
			)
			RETURNING id INTO top_level_category_id;
		END IF;

		FOR category_value IN (SELECT JSONB_ARRAY_ELEMENTS_TEXT(categories -> top_level_category_value)) LOOP
			SELECT id FROM category WHERE community = nassa_id AND name = category_value INTO category_id;
			IF category_id IS NULL
			THEN
				INSERT INTO category (
					community,
					parent,
					short_name,
					name
				)
				VALUES (
					nassa_id,
					top_level_category_id,
					category_value,
					category_value
				)
				RETURNING id INTO category_id;
			END IF;

			INSERT INTO category_for_software (software_id, category_id) VALUES (software_id, category_id) ON CONFLICT DO NOTHING;
		END LOOP;
	END LOOP;
	-- end categories

	-- regular mentions
	FOR mention_entry IN (SELECT JSONB_ARRAY_ELEMENTS(regular_mentions)) LOOP
		SELECT id FROM mention WHERE mention.doi = mention_entry ->> 'doi' INTO mention_id;

		IF mention_id IS NULL
		THEN
			SELECT id FROM mention WHERE mention.title = mention_entry ->> 'title' AND mention.authors IS NOT DISTINCT FROM mention_entry ->> 'authors' INTO mention_id;
		END IF;

		IF mention_id IS NOT NULL
		THEN
			INSERT INTO mention_for_software (mention, software) VALUES (mention_id, software_id) ON CONFLICT DO NOTHING;
		ELSE
			INSERT INTO mention (SELECT * FROM JSONB_POPULATE_RECORD(NULL::mention, mention_entry)) RETURNING id INTO mention_id;
			INSERT INTO mention_for_software (mention, software) VALUES (mention_id, software_id) ON CONFLICT DO NOTHING;
		END IF;
	END LOOP;
	-- end regular mentions
END
$$;
