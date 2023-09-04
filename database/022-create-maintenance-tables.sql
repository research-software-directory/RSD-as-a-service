-- SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE global_announcement (
--	trick to only have one row in this table:
	id BOOLEAN DEFAULT TRUE PRIMARY KEY CHECK (id),
	text VARCHAR(2000),
	enabled BOOLEAN DEFAULT FALSE NOT NULL,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_global_announcement () RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = TRUE;
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_global_announcement BEFORE INSERT ON global_announcement FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_global_announcement();

CREATE FUNCTION sanitise_update_global_announcement() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_global_announcement BEFORE UPDATE ON global_announcement FOR EACH ROW EXECUTE PROCEDURE sanitise_update_global_announcement();

ALTER TABLE global_announcement ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON global_announcement FOR SELECT TO rsd_web_anon, rsd_user USING (TRUE);

CREATE POLICY admin_all_rights ON global_announcement TO rsd_admin USING (TRUE) WITH CHECK (TRUE);

INSERT INTO global_announcement (id) VALUES (TRUE)
