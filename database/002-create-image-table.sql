-- SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2022 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 dv4all
--
-- SPDX-License-Identifier: Apache-2.0

-- create extension pgcrypto to encrypt base64 content
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE image (
	id VARCHAR(40) PRIMARY KEY,
	data VARCHAR(2750000) NOT NULL,
	mime_type VARCHAR(100) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_image() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
-- create SHA-1 id based on provided data content
	NEW.id = ENCODE(DIGEST(NEW.data, 'sha1'), 'hex');
	NEW.created_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_image BEFORE INSERT ON image FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_image();

CREATE FUNCTION sanitise_update_image() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
-- create SHA-1 id based on provided data content
	NEW.id = ENCODE(DIGEST(NEW.data, 'sha1'), 'hex');
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_image BEFORE UPDATE ON image FOR EACH ROW EXECUTE PROCEDURE sanitise_update_image();


-- ----------------------------------------
-- RPC to get image by id => sha-1 of data
-- ----------------------------------------

CREATE FUNCTION get_image(uid VARCHAR(40)) RETURNS BYTEA STABLE LANGUAGE plpgsql AS
$$
DECLARE headers TEXT;
DECLARE blob BYTEA;

BEGIN
	SELECT format(
		'[{"Content-Type": "%s"},'
		'{"Content-Disposition": "inline; filename=\"%s\""},'
		'{"Cache-Control": "max-age=259200"}]',
		mime_type,
		uid)
	FROM image WHERE id = uid INTO headers;

	PERFORM set_config('response.headers', headers, TRUE);

	SELECT decode(image.data, 'base64') FROM image WHERE id = uid INTO blob;

	IF FOUND
		THEN RETURN(blob);
	ELSE RAISE SQLSTATE 'PT404'
		USING
			message = 'NOT FOUND',
			detail = 'File not found',
			hint = format('%s seems to be an invalid file id', image_id);
	END IF;
END
$$;

