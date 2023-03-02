-- SPDX-FileCopyrightText: 2021 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2023 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 - 2023 dv4all
-- SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
--
-- SPDX-License-Identifier: Apache-2.0

CREATE TABLE account (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL,
	agree_terms BOOLEAN DEFAULT FALSE NOT NULL,
	agree_terms_updated_at TIMESTAMPTZ,
	notice_privacy_statement BOOLEAN DEFAULT FALSE NOT NULL,
	notice_privacy_statement_updated_at TIMESTAMPTZ
);

CREATE FUNCTION sanitise_insert_account() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	NEW.agree_terms_updated_at = NEW.created_at;
	NEW.notice_privacy_statement_updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_account BEFORE INSERT ON account FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_account();


CREATE FUNCTION sanitise_update_account() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	IF NEW.agree_terms != OLD.agree_terms THEN
		NEW.agree_terms_updated_at = NEW.updated_at;
	END IF;
	IF NEW.notice_privacy_statement != OLD.notice_privacy_statement THEN
		NEW.notice_privacy_statement_updated_at = NEW.updated_at;
	END IF;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_account BEFORE UPDATE ON account FOR EACH ROW EXECUTE PROCEDURE sanitise_update_account();



CREATE TABLE login_for_account (
	id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
	account UUID REFERENCES account (id) NOT NULL,
	provider VARCHAR(100) NOT NULL,
	sub VARCHAR(50) NOT NULL,
	name VARCHAR(200),
	email VARCHAR(200),
	home_organisation VARCHAR(200),
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL,
	UNIQUE(provider, sub)
);

CREATE FUNCTION sanitise_insert_login_for_account() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_login_for_account BEFORE INSERT ON login_for_account FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_login_for_account();


CREATE FUNCTION sanitise_update_login_for_account() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_login_for_account BEFORE UPDATE ON login_for_account FOR EACH ROW EXECUTE PROCEDURE sanitise_update_login_for_account();



CREATE TABLE orcid_whitelist (
	orcid VARCHAR(19) PRIMARY KEY CHECK (orcid ~ '^\d{4}-\d{4}-\d{4}-\d{3}[0-9X]$')
);


CREATE FUNCTION delete_account(account_id UUID) RETURNS VOID LANGUAGE plpgsql VOLATILE AS
$$
DECLARE account_authenticated UUID;
BEGIN
	IF
		account_id IS NULL
	THEN
		RAISE EXCEPTION USING MESSAGE = 'Please provide an account id';
	END IF;
	account_authenticated = uuid(current_setting('request.jwt.claims', TRUE)::json->>'account');
	IF
			CURRENT_USER IS DISTINCT FROM 'rsd_admin'
		AND
			(SELECT rolsuper FROM pg_roles WHERE rolname = CURRENT_USER) IS DISTINCT FROM TRUE
		AND
			(
				account_authenticated IS NULL OR account_authenticated IS DISTINCT FROM account_id
			)
	THEN
		RAISE EXCEPTION USING MESSAGE = 'You are not allowed to delete this account';
	END IF;
	DELETE FROM maintainer_for_software WHERE maintainer = account_id;
	DELETE FROM maintainer_for_project WHERE maintainer = account_id;
	DELETE FROM maintainer_for_organisation WHERE maintainer = account_id;
	DELETE FROM invite_maintainer_for_software WHERE created_by = account_id OR claimed_by = account_id;
	DELETE FROM invite_maintainer_for_project WHERE created_by = account_id OR claimed_by = account_id;
	DELETE FROM invite_maintainer_for_organisation WHERE created_by = account_id OR claimed_by = account_id;
	UPDATE organisation SET primary_maintainer = NULL WHERE primary_maintainer = account_id;
	DELETE FROM login_for_account WHERE account = account_id;
	DELETE FROM account WHERE id = account_id;
END
$$;
