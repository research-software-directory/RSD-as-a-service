-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE oaipmh (
--	trick to only have one row in this table:
	id BOOLEAN DEFAULT TRUE PRIMARY KEY CHECK (id),
	data XML,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_oaipmh() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = TRUE;
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_oaipmh BEFORE INSERT ON oaipmh FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_oaipmh();


CREATE FUNCTION sanitise_update_oaipmh() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_oaipmh BEFORE UPDATE ON oaipmh FOR EACH ROW EXECUTE PROCEDURE sanitise_update_oaipmh();

INSERT INTO oaipmh (id) VALUES (TRUE)
