-- SPDX-FileCopyrightText: 2021 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
-- SPDX-FileCopyrightText: 2021 - 2025 Netherlands eScience Center
-- SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
-- SPDX-FileCopyrightText: 2022 - 2023 dv4all
-- SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
-- SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
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
	ELSE
		NEW.agree_terms_updated_at = OLD.agree_terms_updated_at;
	END IF;
	IF NEW.notice_privacy_statement != OLD.notice_privacy_statement THEN
		NEW.notice_privacy_statement_updated_at = NEW.updated_at;
	ELSE
		NEW.notice_privacy_statement_updated_at = OLD.notice_privacy_statement_updated_at;
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
	last_login_date TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL,
	UNIQUE(provider, sub)
);

CREATE INDEX login_for_account_account_idx ON login_for_account(account);

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


CREATE TABLE admin_account (
	account_id UUID REFERENCES account (id) PRIMARY KEY
);


CREATE TABLE account_invite (
	id UUID PRIMARY KEY,
	uses_left INTEGER, --NULL means bulk (i.e. infinite use) invite
	expires_at TIMESTAMPTZ NOT NULL,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_account_invite() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = gen_random_uuid();
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_account_invite BEFORE INSERT ON account_invite FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_account_invite();

CREATE FUNCTION sanitise_update_account_invite() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.id = OLD.id;
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_account_invite BEFORE UPDATE ON account_invite FOR EACH ROW EXECUTE PROCEDURE sanitise_update_login_for_account();

ALTER TABLE account_invite ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_all_rights ON account_invite TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);
