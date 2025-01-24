-- SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
-- SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
--
-- SPDX-License-Identifier: Apache-2.0

-- RSD info table
-- used to obtain RSD name to use for remotes
-- it should provide basic info about rsd instance
-- manually insert remote_name property
CREATE TABLE rsd_info (
	key VARCHAR(100) PRIMARY KEY,
	value VARCHAR(250) NOT NULL,
	public BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMPTZ NOT NULL,
	updated_at TIMESTAMPTZ NOT NULL
);

CREATE FUNCTION sanitise_insert_rsd_info() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.created_at = LOCALTIMESTAMP;
	NEW.updated_at = NEW.created_at;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_insert_rsd_info BEFORE INSERT ON
	rsd_info FOR EACH ROW EXECUTE PROCEDURE sanitise_insert_rsd_info();

CREATE FUNCTION sanitise_update_rsd_info() RETURNS TRIGGER LANGUAGE plpgsql AS
$$
BEGIN
	NEW.created_at = OLD.created_at;
	NEW.updated_at = LOCALTIMESTAMP;
	return NEW;
END
$$;

CREATE TRIGGER sanitise_update_rsd_info BEFORE UPDATE ON
	rsd_info FOR EACH ROW EXECUTE PROCEDURE sanitise_update_rsd_info();

-- RLS
-- rsd info table
ALTER TABLE rsd_info ENABLE ROW LEVEL SECURITY;

-- anyone can read (SELECT) public keys
CREATE POLICY anyone_can_read ON rsd_info FOR SELECT TO rsd_web_anon, rsd_user
	USING (public = TRUE);

-- rsd_admin has all rights
CREATE POLICY admin_all_rights ON rsd_info TO rsd_admin
	USING (TRUE)
	WITH CHECK (TRUE);
