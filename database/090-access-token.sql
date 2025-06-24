-- SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
-- SPDX-FileCopyrightText: 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE user_access_token (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	secret VARCHAR NOT NULL,
	account UUID REFERENCES account (id) NOT NULL,
	expires_at TIMESTAMPTZ NOT NULL,
	display_name VARCHAR(100) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL);

CREATE INDEX user_access_token_account_idx ON user_access_token(account);


CREATE FUNCTION sanitise_insert_user_access_token() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	IF NEW.expires_at - NEW.created_at > INTERVAL '365 days' THEN
		RAISE EXCEPTION 'Access tokens should expire within one year';
	END IF;
	IF NEW.expires_at::date < NEW.created_at::date THEN
		RAISE EXCEPTION 'The selected expiration date cannot be in the past';
	END IF;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_user_access_token BEFORE INSERT ON user_access_token FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_user_access_token();


CREATE FUNCTION sanitise_update_user_access_token() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	RAISE EXCEPTION 'Access tokens are not allowed to be updated';
END
$$;

CREATE TRIGGER sanitise_update_user_access_token BEFORE UPDATE ON user_access_token FOR EACH ROW EXECUTE PROCEDURE sanitise_update_user_access_token();


ALTER TABLE user_access_token ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_select_all ON user_access_token FOR SELECT TO rsd_admin
	USING (TRUE);

CREATE POLICY admin_insert_all ON user_access_token FOR INSERT TO rsd_admin
	WITH CHECK (TRUE);

CREATE POLICY admin_delete_all ON user_access_token FOR DELETE TO rsd_admin
	USING (TRUE);


-- this function prevents the secret from being exposed
CREATE FUNCTION my_user_access_tokens() RETURNS TABLE (
	id UUID,
	account UUID,
	expires_at TIMESTAMPTZ,
	display_name VARCHAR,
	created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS
$$
	SELECT
		id,
		account,
		expires_at,
		display_name,
		created_at
	FROM user_access_token
	WHERE
		account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
$$;


CREATE FUNCTION delete_my_user_access_token(id UUID) RETURNS VOID
LANGUAGE sql
VOLATILE
SECURITY DEFINER
AS
$$
	DELETE FROM user_access_token
	WHERE
		account = uuid(current_setting('request.jwt.claims', FALSE)::json->>'account')
		AND
		user_access_token.id = delete_my_user_access_token.id;
$$;
