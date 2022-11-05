-- create extension pgcrypto to encrypt base64 content
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE image (
	id VARCHAR(40) PRIMARY KEY,
	data VARCHAR(2750000) NOT NULL,
	mime_type VARCHAR(100) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL
);

-- SHA-1 -> 40 positions -> SHA-1 is sufficient for our purpose
-- 22c219648f00c61e5b3b1bd81ffa8e7767e2e3c5
-- 9c187ab5131ccaaba1cf0088d93d58b3463ae9d6
-- SHA-256 -> 64 positions
-- 9e1b04359ce9f650852b7f468eb9cbaa8198d8678a7ddce5caaeb123b76439ff
-- fe5d98f8b4a0c68cfe7d951f7aede978c740be64f38118c03043a38f

CREATE FUNCTION sanitise_insert_image() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
-- create SHA-1 id based on provided data content
	NEW.id = encode(digest(NEW.data,'sha1'),'hex');
	NEW.created_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_image BEFORE INSERT ON image FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_image();
-- NOT SURE ABOUT UPDATE
CREATE TRIGGER sanitise_update_image BEFORE UPDATE ON image FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_image();

-- --------------------------------------
-- RLS
-- --------------------------------------

ALTER TABLE image ENABLE ROW LEVEL SECURITY;

CREATE POLICY anyone_can_read ON image FOR SELECT TO web_anon, rsd_user
	USING (TRUE)
;

CREATE POLICY rsd_user_all_rights ON image TO rsd_user
	USING (TRUE)
	WITH CHECK (TRUE)
;

CREATE POLICY admin_all_rights ON image TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE)
;

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

