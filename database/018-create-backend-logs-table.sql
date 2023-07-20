-- SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2023 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE backend_log (
	id UUID PRIMARY KEY,
	service_name VARCHAR,
	table_name VARCHAR,
	reference_id UUID,
	message VARCHAR,
	stack_trace VARCHAR,
	other_data JSONB,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_backend_log() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_backend_log BEFORE INSERT ON backend_log FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_backend_log();

CREATE FUNCTION sanitise_update_backend_log() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_backend_log BEFORE UPDATE ON backend_log FOR EACH ROW EXECUTE PROCEDURE sanitise_update_backend_log();
